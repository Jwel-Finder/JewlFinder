/**
 * Shared metals price store – used by Navbar AND billing.
 * Fetches gold/silver prices from MetalPriceAPI, falls back to mock prices.
 */
import { create } from 'zustand';

const OUNCE_TO_GRAM = 31.1034768;

// Realistic mock prices (₹ per gram) used when API is unavailable
const MOCK_GOLD_PRICE = 7450;
const MOCK_SILVER_PRICE = 92;

export const useMetalsStore = create((set, get) => ({
    metals: {
        gold: { price: null, prev: null, change: null, changePct: null },
        silver: { price: null, prev: null, change: null, changePct: null },
    },
    loading: true,
    error: null,
    updatedAt: null,
    isMock: false,
    _intervalId: null,

    /** Call once on mount (Navbar does this). Starts polling. */
    startPolling: (apiUrl, baseCurrency, apiKey, pollSeconds = 60) => {
        // Prevent duplicate polling
        const existing = get()._intervalId;
        if (existing) return;

        const fetchMetals = async () => {
            set({ loading: true, error: null });
            try {
                if (!apiKey) throw new Error('No API key');

                const latestUrl = `${apiUrl}/latest?api_key=${apiKey}&base=${baseCurrency}&currencies=XAU,XAG`;
                const latestRes = await fetch(latestUrl);
                const latest = await latestRes.json();
                const goldLatestRate = latest?.rates?.XAU ?? latest?.data?.rates?.XAU ?? latest?.data?.XAU ?? null;
                const silverLatestRate = latest?.rates?.XAG ?? latest?.data?.rates?.XAG ?? latest?.data?.XAG ?? null;

                if (!goldLatestRate) throw new Error('Invalid API response');

                // Yesterday close
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const dateStr = yesterday.toISOString().split('T')[0];
                let prev = {};
                try {
                    const prevUrl = `${apiUrl}/historical?date=${dateStr}&api_key=${apiKey}&base=${baseCurrency}&currencies=XAU,XAG`;
                    const prevRes = await fetch(prevUrl);
                    if (prevRes.ok) prev = await prevRes.json();
                } catch { prev = {}; }

                const goldPrevRate = prev?.rates?.XAU ?? prev?.data?.rates?.XAU ?? prev?.data?.XAU ?? null;
                const silverPrevRate = prev?.rates?.XAG ?? prev?.data?.rates?.XAG ?? prev?.data?.XAG ?? null;

                const toPG = (r) => r ? (1 / r) / OUNCE_TO_GRAM : null;
                const goldPricePerGram = toPG(goldLatestRate);
                const silverPricePerGram = toPG(silverLatestRate);
                const goldPrevPerGram = toPG(goldPrevRate);
                const silverPrevPerGram = toPG(silverPrevRate);

                const goldChange = (goldPricePerGram && goldPrevPerGram) ? goldPricePerGram - goldPrevPerGram : null;
                const silverChange = (silverPricePerGram && silverPrevPerGram) ? silverPricePerGram - silverPrevPerGram : null;
                const goldPct = (goldChange !== null && goldPrevPerGram) ? (goldChange / goldPrevPerGram) * 100 : null;
                const silverPct = (silverChange !== null && silverPrevPerGram) ? (silverChange / silverPrevPerGram) * 100 : null;

                set({
                    metals: {
                        gold: { price: goldPricePerGram, prev: goldPrevPerGram, change: goldChange, changePct: goldPct },
                        silver: { price: silverPricePerGram, prev: silverPrevPerGram, change: silverChange, changePct: silverPct },
                    },
                    updatedAt: new Date().toISOString(),
                    loading: false,
                    isMock: false,
                });
            } catch {
                // Fallback to mock prices
                set({
                    metals: {
                        gold: { price: MOCK_GOLD_PRICE, prev: null, change: null, changePct: null },
                        silver: { price: MOCK_SILVER_PRICE, prev: null, change: null, changePct: null },
                    },
                    loading: false,
                    error: 'Using mock prices',
                    isMock: true,
                });
            }
        };

        fetchMetals();
        const id = setInterval(fetchMetals, pollSeconds * 1000);
        set({ _intervalId: id });
    },

    stopPolling: () => {
        const id = get()._intervalId;
        if (id) clearInterval(id);
        set({ _intervalId: null });
    },
}));
