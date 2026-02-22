import { create } from 'zustand';
import { defaultItem, defaultCustomer, generateBillNumber, calcBillTotal } from '../utils/billingUtils';

/**
 * Vendor Billing Store
 * – Current bill state (customer, items, payment)
 * – Session-only bill history (clears on refresh)
 * – Vendor settings (persisted to localStorage)
 */

const loadVendorSettings = () => {
    try {
        const stored = localStorage.getItem('jf_vendor_billing_settings');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {
        shopName: '',
        logo: null,        // data-URL string
        address: '',
        gstNumber: '',
        billStyle: 'detailed',  // 'simple' | 'detailed'
        roundOff: false,
    };
};

const saveVendorSettings = (settings) => {
    try {
        localStorage.setItem('jf_vendor_billing_settings', JSON.stringify(settings));
    } catch { /* ignore */ }
};

export const useBillingStore = create((set, get) => ({

    // ── Vendor settings ───────────────────────────────────
    vendor: loadVendorSettings(),

    updateVendorSettings: (patch) => {
        const updated = { ...get().vendor, ...patch };
        saveVendorSettings(updated);
        set({ vendor: updated });
    },

    // ── Current bill ──────────────────────────────────────
    customer: defaultCustomer(),
    items: [defaultItem()],
    paymentStatus: 'Pending',   // Pending | Paid | Partial
    paymentMode: 'Cash',        // Cash | UPI | Card

    updateCustomer: (patch) =>
        set((s) => ({ customer: { ...s.customer, ...patch } })),

    addItem: () =>
        set((s) => ({ items: [...s.items, defaultItem()] })),

    removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

    updateItem: (id, patch) =>
        set((s) => ({
            items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

    setPaymentStatus: (status) => set({ paymentStatus: status }),
    setPaymentMode: (mode) => set({ paymentMode: mode }),

    // ── Save / Reset ──────────────────────────────────────
    billHistory: [],

    saveBill: () => {
        const state = get();
        const bill = {
            billNumber: generateBillNumber(),
            date: new Date().toISOString(),
            customer: { ...state.customer },
            items: state.items.map((i) => ({ ...i })),
            paymentStatus: state.paymentStatus,
            paymentMode: state.paymentMode,
            grandTotal: calcBillTotal(state.items, state.vendor.roundOff),
        };
        set((s) => ({ billHistory: [bill, ...s.billHistory] }));
        return bill;
    },

    resetBill: () =>
        set({
            customer: defaultCustomer(),
            items: [defaultItem()],
            paymentStatus: 'Pending',
            paymentMode: 'Cash',
        }),

    loadBillFromHistory: (billNumber) => {
        const bill = get().billHistory.find((b) => b.billNumber === billNumber);
        if (!bill) return;
        set({
            customer: { ...bill.customer },
            items: bill.items.map((i) => ({ ...i })),
            paymentStatus: bill.paymentStatus,
            paymentMode: bill.paymentMode,
        });
    },
}));
