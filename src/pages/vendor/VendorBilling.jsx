import { useState, useRef, useEffect } from 'react';
import { useBillingStore } from '../../store/billingStore';
import { useMetalsStore } from '../../store/metalsStore';
import { calcItemBreakdown, calcBillTotal, generateBillText, generateBillNumber, calcGoldValue, percentToCharge, chargeToPercent } from '../../utils/billingUtils';
import BillPreview from '../../components/billing/BillPreview';
import {
    Plus, Trash2, Printer, FileText, Copy, Share2,
    Settings, X, ChevronDown, ChevronUp, RotateCcw,
    Save, Receipt, Upload, Eye, EyeOff, Clock, Check
} from 'lucide-react';

const ITEM_PRESETS = ['Ring', 'Chain', 'Coin', 'Necklace', 'Bangle', 'Earring', 'Custom'];
const PURITY_PRESETS = ['22K', '24K', '18K', 'Custom'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Partial'];
const PAYMENT_MODES = ['Cash', 'UPI', 'Card'];

const VendorBilling = () => {
    const {
        vendor, updateVendorSettings,
        customer, updateCustomer,
        items, addItem, removeItem, updateItem,
        paymentStatus, paymentMode, setPaymentStatus, setPaymentMode,
        billHistory, saveBill, resetBill, loadBillFromHistory,
    } = useBillingStore();

    const [showSettings, setShowSettings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [savedBill, setSavedBill] = useState(null);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState(false);
    const logoInputRef = useRef(null);

    // ── Handlers ──────────────────────────────────────────

    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => updateVendorSettings({ logo: ev.target.result });
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!customer.name.trim()) {
            alert('Please enter a customer name.');
            return;
        }
        const bill = saveBill();
        setSavedBill(bill);
        setSaveFeedback(true);
        setTimeout(() => setSaveFeedback(false), 2000);
    };

    const handleNewBill = () => {
        resetBill();
        setSavedBill(null);
    };

    const handlePrint = () => {
        const content = document.getElementById('bill-preview-content');
        if (!content) return;
        const win = window.open('', '_blank');
        win.document.write(`
      <html><head><title>Bill</title>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Lato', sans-serif; padding: 24px; color: #333; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Playfair Display', serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 6px 8px; }
        @media print { body { padding: 0; } }
      </style></head><body>${content.innerHTML}</body></html>
    `);
        win.document.close();
        setTimeout(() => { win.print(); }, 400);
    };

    const handleCopyText = () => {
        const billObj = savedBill || {
            billNumber: generateBillNumber(),
            date: new Date().toISOString(),
            customer,
            items,
            paymentStatus,
            paymentMode,
            grandTotal: calcBillTotal(items, vendor.roundOff),
        };
        const text = generateBillText(billObj, vendor);
        navigator.clipboard.writeText(text).then(() => {
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
        });
    };

    const handleWhatsApp = () => {
        const billObj = savedBill || {
            billNumber: generateBillNumber(),
            date: new Date().toISOString(),
            customer,
            items,
            paymentStatus,
            paymentMode,
            grandTotal: calcBillTotal(items, vendor.roundOff),
        };
        const text = generateBillText(billObj, vendor);
        const phone = customer.phone?.replace(/\D/g, '') || '';
        const url = `https://wa.me/${phone ? `91${phone}` : ''}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleGeneratePDF = () => {
        handlePrint(); // Use print dialog to save as PDF
    };

    const currentBill = {
        billNumber: savedBill?.billNumber || '—',
        date: savedBill?.date || new Date().toISOString(),
        customer,
        items,
        paymentStatus,
        paymentMode,
        grandTotal: calcBillTotal(items, vendor.roundOff),
    };

    // ── Render ────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-cream py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ═══ Header ══════════════════════════════════════ */}
                <div className="mb-8 border-b border-gold/20 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1">
                            <span className="text-gold-dark">Billing</span> Module
                        </h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-xs">
                            Create &amp; share gold bills instantly
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gold/20 bg-white text-sm font-medium text-gray-700 hover:border-gold hover:shadow-md transition-all rounded-md"
                        >
                            <Clock className="w-4 h-4" />
                            <span className="hidden sm:inline">History</span>
                            {billHistory.length > 0 && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-gold/10 text-gold-dark text-[11px] font-bold flex items-center justify-center">
                                    {billHistory.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gold/20 bg-white text-sm font-medium text-gray-700 hover:border-gold hover:shadow-md transition-all rounded-md"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </button>
                    </div>
                </div>

                {/* ═══ History Drawer ══════════════════════════════ */}
                {showHistory && billHistory.length > 0 && (
                    <div className="mb-6 bg-ivory p-4 sm:p-5 border border-gold/10 rounded-lg animate-fadeIn">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-serif font-bold text-gray-900 text-sm">Recent Bills</h3>
                            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {billHistory.map((b) => (
                                <button
                                    key={b.billNumber}
                                    onClick={() => { loadBillFromHistory(b.billNumber); setSavedBill(b); setShowHistory(false); }}
                                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 hover:border-gold/30 transition-all rounded-md text-left"
                                >
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">{b.billNumber}</p>
                                        <p className="text-[11px] text-gray-500">{b.customer.name} · {new Date(b.date).toLocaleDateString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-serif font-bold text-gold-dark">₹{b.grandTotal.toLocaleString('en-IN')}</p>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${b.paymentStatus === 'Paid' ? 'text-green-600' : b.paymentStatus === 'Partial' ? 'text-yellow-600' : 'text-red-500'}`}>
                                            {b.paymentStatus}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ Main Layout ═════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Left: Bill Form ───────────────────────────── */}
                    <div className="space-y-5">

                        {/* Customer Section */}
                        <div className="bg-ivory p-5 sm:p-6 border border-gold/10 rounded-lg">
                            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Customer Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Name *</label>
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={(e) => updateCustomer({ name: e.target.value })}
                                        placeholder="Customer full name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Phone</label>
                                        <input
                                            type="tel"
                                            value={customer.phone}
                                            onChange={(e) => updateCustomer({ phone: e.target.value })}
                                            placeholder="Phone number"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Notes</label>
                                        <input
                                            type="text"
                                            value={customer.notes}
                                            onChange={(e) => updateCustomer({ notes: e.target.value })}
                                            placeholder="Optional notes"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Items */}
                        <div className="bg-ivory p-5 sm:p-6 border border-gold/10 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-serif font-bold text-gray-900">Products</h2>
                                <button
                                    onClick={addItem}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gold/20 text-xs font-bold text-gold-dark hover:bg-gold/5 hover:border-gold transition-all rounded-md"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, idx) => (
                                    <ProductItemCard
                                        key={item.id}
                                        item={item}
                                        index={idx}
                                        onUpdate={(patch) => updateItem(item.id, patch)}
                                        onRemove={() => removeItem(item.id)}
                                        canRemove={items.length > 1}
                                        apiGoldRate={useMetalsStore.getState().metals.gold.price}
                                        isMockPrice={useMetalsStore.getState().isMock}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-ivory p-5 sm:p-6 border border-gold/10 rounded-lg">
                            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Payment</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white appearance-none"
                                    >
                                        {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Mode</label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white appearance-none"
                                    >
                                        {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 gradient-gold text-white text-sm font-bold rounded-md hover:opacity-90 transition-all"
                            >
                                {saveFeedback ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {saveFeedback ? 'Saved!' : 'Save Bill'}
                            </button>
                            <button
                                onClick={handleNewBill}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gold/30 hover:shadow-sm transition-all rounded-md"
                            >
                                <RotateCcw className="w-4 h-4" /> New Bill
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gold/30 hover:shadow-sm transition-all rounded-md"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gold/30 hover:shadow-sm transition-all rounded-md"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </button>
                            <button
                                onClick={handleCopyText}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gold/30 hover:shadow-sm transition-all rounded-md"
                            >
                                {copyFeedback ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                {copyFeedback ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={handleWhatsApp}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all rounded-md"
                            >
                                <Share2 className="w-4 h-4" /> WhatsApp
                            </button>
                        </div>

                        {/* Mobile Preview Toggle */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-charcoal text-white text-sm font-bold rounded-md"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Hide Preview' : 'Show Bill Preview'}
                        </button>
                    </div>

                    {/* ── Right: Live Preview ───────────────────────── */}
                    <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Live Preview</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateVendorSettings({ billStyle: vendor.billStyle === 'detailed' ? 'simple' : 'detailed' })}
                                        className="text-[11px] px-3 py-1.5 border border-gold/20 rounded-full text-gray-600 hover:border-gold hover:text-gold-dark transition-all font-bold uppercase tracking-wider"
                                    >
                                        {vendor.billStyle === 'detailed' ? 'Detailed' : 'Simple'}
                                    </button>
                                </div>
                            </div>
                            <BillPreview
                                bill={currentBill}
                                vendor={vendor}
                                style={vendor.billStyle}
                                roundOff={vendor.roundOff}
                            />
                        </div>
                    </div>
                </div>

                {/* ═══ Grand Total Bar ═════════════════════════════ */}
                <div className="mt-6 bg-charcoal text-white p-5 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-0.5">Grand Total</p>
                        <p className="text-3xl font-serif font-bold text-gold">
                            ₹{calcBillTotal(items, vendor.roundOff).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-0.5">Items</p>
                        <p className="text-xl font-serif font-bold">{items.length}</p>
                    </div>
                </div>
            </div>

            {/* ═══ Settings Modal ════════════════════════════════ */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowSettings(false)}>
                    <div
                        className="bg-white w-full max-w-md rounded-lg border border-gold/20 shadow-xl animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-serif font-bold text-lg text-gray-900">Bill Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Shop Name */}
                            <div>
                                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Shop Name</label>
                                <input
                                    type="text"
                                    value={vendor.shopName}
                                    onChange={(e) => updateVendorSettings({ shopName: e.target.value })}
                                    placeholder="Your jewellery shop name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
                                />
                            </div>

                            {/* Logo */}
                            <div>
                                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Logo</label>
                                <div className="flex items-center gap-3">
                                    {vendor.logo ? (
                                        <img src={vendor.logo} alt="Logo" className="w-14 h-14 rounded-full object-contain border border-gold/20" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                            <Receipt className="w-6 h-6" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-xs font-bold text-gray-600 hover:border-gold/30 transition-all"
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                    </button>
                                    {vendor.logo && (
                                        <button
                                            onClick={() => updateVendorSettings({ logo: null })}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Address</label>
                                <textarea
                                    value={vendor.address}
                                    onChange={(e) => updateVendorSettings({ address: e.target.value })}
                                    placeholder="Shop address"
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* GST Number */}
                            <div>
                                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-bold">GST Number</label>
                                <input
                                    type="text"
                                    value={vendor.gstNumber}
                                    onChange={(e) => updateVendorSettings({ gstNumber: e.target.value })}
                                    placeholder="GSTIN (optional)"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
                                />
                            </div>

                            {/* Bill Style */}
                            <div>
                                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Bill Style</label>
                                <div className="flex gap-2">
                                    {['simple', 'detailed'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => updateVendorSettings({ billStyle: s })}
                                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all
                        ${vendor.billStyle === s
                                                    ? 'bg-gold/10 border-gold text-gold-dark'
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gold/30'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Round Off */}
                            <div className="flex items-center justify-between p-3 bg-cream/60 rounded-md border border-gold/10">
                                <span className="text-sm text-gray-700 font-medium">Round-off totals</span>
                                <button
                                    onClick={() => updateVendorSettings({ roundOff: !vendor.roundOff })}
                                    className={`w-10 h-6 rounded-full relative transition-all ${vendor.roundOff ? 'bg-gold' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${vendor.roundOff ? 'left-[18px]' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="w-full py-3 gradient-gold text-white text-sm font-bold rounded-md hover:opacity-90 transition-all"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ╔═══════════════════════════════════════════════════════╗
// ║  Product Item Card (sub-component)                   ║
// ╚═══════════════════════════════════════════════════════╝

const ProductItemCard = ({ item, index, onUpdate, onRemove, canRemove, apiGoldRate, isMockPrice }) => {
    const [expanded, setExpanded] = useState(true);
    const [rateAutoFilled, setRateAutoFilled] = useState(false);
    const bd = calcItemBreakdown(item);

    // Auto-fill gold rate from API / mock when the field is empty
    useEffect(() => {
        if (apiGoldRate && !item.goldRate) {
            onUpdate({ goldRate: String(Math.round(apiGoldRate)) });
            setRateAutoFilled(true);
        }
    }, [apiGoldRate]);

    const displayName = item.itemName === 'Custom' ? (item.customItemName || 'Custom Item') : item.itemName;

    return (
        <div className="bg-white border border-gray-100 hover:border-gold/20 rounded-lg transition-all overflow-hidden">
            {/* Collapsed Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gold/10 text-gold-dark text-xs font-bold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{displayName} <span className="text-gray-400 font-normal">· {item.purity === 'Custom' ? item.customPurity || 'Custom' : item.purity}</span></p>
                        <p className="text-xs text-gold-dark font-medium">₹{bd.itemTotal.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
            </div>

            {/* Expanded Form */}
            {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">
                    {/* Item Name + Purity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Item</label>
                            <select
                                value={item.itemName}
                                onChange={(e) => onUpdate({ itemName: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all bg-white appearance-none"
                            >
                                {ITEM_PRESETS.map((p) => <option key={p}>{p}</option>)}
                            </select>
                            {item.itemName === 'Custom' && (
                                <input
                                    type="text"
                                    value={item.customItemName}
                                    onChange={(e) => onUpdate({ customItemName: e.target.value })}
                                    placeholder="Custom item name"
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Purity</label>
                            <select
                                value={item.purity}
                                onChange={(e) => onUpdate({ purity: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all bg-white appearance-none"
                            >
                                {PURITY_PRESETS.map((p) => <option key={p}>{p}</option>)}
                            </select>
                            {item.purity === 'Custom' && (
                                <input
                                    type="text"
                                    value={item.customPurity}
                                    onChange={(e) => onUpdate({ customPurity: e.target.value })}
                                    placeholder="e.g. 20K"
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                />
                            )}
                        </div>
                    </div>

                    {/* Weights */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Gross Weight (g)</label>
                            <input
                                type="number"
                                value={item.grossWeight}
                                onChange={(e) => onUpdate({ grossWeight: e.target.value })}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Net Weight (g)</label>
                            <input
                                type="number"
                                value={item.netWeight}
                                onChange={(e) => onUpdate({ netWeight: e.target.value })}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Gold Rate */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Gold Rate (₹/gram)</label>
                            {apiGoldRate && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isMockPrice
                                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                        : 'bg-green-100 text-green-700 border border-green-200'
                                    }`}>
                                    {isMockPrice ? 'Mock Price' : 'Live Rate'}
                                </span>
                            )}
                        </div>
                        <input
                            type="number"
                            value={item.goldRate}
                            onChange={(e) => {
                                onUpdate({ goldRate: e.target.value });
                                setRateAutoFilled(false);
                            }}
                            placeholder={apiGoldRate ? `₹${Math.round(apiGoldRate)}` : 'e.g. 6500'}
                            min="0"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                        />
                        {item.netWeight && item.goldRate && (
                            <p className="text-[11px] text-gold-dark mt-1 font-medium">
                                Gold Value: ₹{bd.goldValue.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>

                    {/* Making Charge – dual fields */}
                    <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Making Charge</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={item.makingChargePercent}
                                        onChange={(e) => {
                                            const pct = e.target.value;
                                            const val = percentToCharge(bd.goldValue, pct);
                                            onUpdate({ makingChargePercent: pct, makingChargeValue: val });
                                        }}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">%</span>
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={item.makingChargeValue}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const pct = chargeToPercent(bd.goldValue, val);
                                            onUpdate({ makingChargeValue: val, makingChargePercent: pct });
                                        }}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">₹</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wastage – dual fields */}
                    <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Wastage</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={item.wastagePercent}
                                        onChange={(e) => {
                                            const pct = e.target.value;
                                            const val = percentToCharge(bd.goldValue, pct);
                                            onUpdate({ wastagePercent: pct, wastageValue: val });
                                        }}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">%</span>
                                </div>
                            </div>
                            <div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={item.wastageValue}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const pct = chargeToPercent(bd.goldValue, val);
                                            onUpdate({ wastageValue: val, wastagePercent: pct });
                                        }}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-md text-sm focus:border-gold outline-none transition-all"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">₹</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GST Toggle */}
                    <div className="flex items-center justify-between p-3 bg-cream/40 rounded-md">
                        <span className="text-xs text-gray-600 font-medium">Apply GST (3%)</span>
                        <button
                            onClick={() => onUpdate({ gstEnabled: !item.gstEnabled })}
                            className={`w-10 h-6 rounded-full relative transition-all ${item.gstEnabled ? 'bg-gold' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${item.gstEnabled ? 'left-[18px]' : 'left-0.5'}`} />
                        </button>
                    </div>

                    {/* Item Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Item Total</span>
                        <span className="text-base font-serif font-bold text-gold-dark">₹{bd.itemTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorBilling;
