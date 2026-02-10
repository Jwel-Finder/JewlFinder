import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import MetalCard from '../../components/wallet/MetalCard';
import { Wallet as WalletIcon, History } from 'lucide-react';

const WalletPage = () => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  // Metals (gold/silver) live prices
  const [metals, setMetals] = useState({
    gold: { price: null },
    silver: { price: null },
  });
  const [metalsLoading, setMetalsLoading] = useState(true);
  const [metalsError, setMetalsError] = useState(null);

  // Runtime app settings (non-sensitive config)
  const [appSettings, setAppSettings] = useState(null);

  useEffect(() => {
    fetch('/appsettings.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load appsettings');
        return res.json();
      })
      .then(setAppSettings)
      .catch(() => setAppSettings(null));
  }, []);

  const effectiveApiUrl =
    appSettings?.metals?.apiUrl ??
    import.meta.env.VITE_METALS_API_URL ??
    'https://api.metalpriceapi.com/v1';
  const effectiveBaseCurrency =
    appSettings?.metals?.baseCurrency ?? import.meta.env.VITE_METALS_BASE ?? 'INR';
  const pollIntervalSecondsEffective = Number(
    appSettings?.metals?.pollIntervalSeconds ??
      import.meta.env.VITE_METALS_POLL_INTERVAL ??
      60
  );

  const currencySymbol =
    effectiveBaseCurrency === 'INR'
      ? '₹'
      : effectiveBaseCurrency === 'USD'
      ? '$'
      : `${effectiveBaseCurrency} `;

  const fetchMetals = async () => {
    setMetalsLoading(true);
    setMetalsError(null);
    try {
      const key = import.meta.env.VITE_METALS_API_KEY;
      const baseUrl = effectiveApiUrl;
      const baseCurrency = effectiveBaseCurrency;
      if (!key) {
        setMetalsError('No API key set (VITE_METALS_API_KEY)');
        setMetalsLoading(false);
        return;
      }

      const OUNCE_TO_GRAM = 31.1034768;

      // Latest prices (MetalPriceAPI expects api_key and currencies params)
      const latestUrl = `${baseUrl}/latest?api_key=${key}&base=${baseCurrency}&currencies=XAU,XAG`;
      const latestRes = await fetch(latestUrl);
      const latest = await latestRes.json();
      const goldLatestRate =
        latest?.rates?.XAU ?? latest?.data?.rates?.XAU ?? latest?.data?.XAU ?? null;
      const silverLatestRate =
        latest?.rates?.XAG ?? latest?.data?.rates?.XAG ?? latest?.data?.XAG ?? null;

      // API returns XAU/XAG per base (e.g., XAU per INR). Invert to get base per XAU (price per oz), then convert to per gram.
      const goldPricePerOunce = goldLatestRate ? 1 / goldLatestRate : null;
      const silverPricePerOunce = silverLatestRate ? 1 / silverLatestRate : null;

      const goldPricePerGram = goldPricePerOunce ? goldPricePerOunce / OUNCE_TO_GRAM : null;
      const silverPricePerGram = silverPricePerOunce
        ? silverPricePerOunce / OUNCE_TO_GRAM
        : null;

      setMetals({
        gold: { price: goldPricePerGram },
        silver: { price: silverPricePerGram },
      });
      setMetalsLoading(false);
    } catch (err) {
      setMetalsError('Failed to fetch metals data');
      setMetalsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetals();
    const id = setInterval(fetchMetals, pollIntervalSecondsEffective * 1000);
    return () => clearInterval(id);
  }, [pollIntervalSecondsEffective, effectiveApiUrl, effectiveBaseCurrency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <WalletIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                  My Wallet
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-sans">
                  Buy and sell gold & silver at live market prices
                </p>
              </div>
            </div>

            {/* Transaction History Button */}
            <button
              onClick={() => navigate(`/${role}/transaction-history`)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">Transaction History</span>
              <span className="sm:hidden">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {metalsError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error loading metal prices</p>
            <p className="text-sm mt-1">{metalsError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gold Card */}
          <MetalCard
            metalName="Gold"
            pricePerGram={metals.gold.price}
            currency={currencySymbol}
            isLoading={metalsLoading}
          />

          {/* Silver Card */}
          <MetalCard
            metalName="Silver"
            pricePerGram={metals.silver.price}
            currency={currencySymbol}
            isLoading={metalsLoading}
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">
            How it works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Live Prices</h4>
              <p className="text-sm text-gray-600">
                Real-time gold and silver prices updated every minute from global markets.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">🔒</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Trading</h4>
              <p className="text-sm text-gray-600">
                Your transactions are protected with bank-grade security and encryption.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Settlement</h4>
              <p className="text-sm text-gray-600">
                Buy or sell instantly with immediate settlement and balance updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
