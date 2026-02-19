import { useState, useEffect, useCallback } from 'react';
import { Plus, X, IndianRupee, Gavel, Scale, MapPin, Clock, Eye, Shield, ChevronDown, ChevronUp, Send, Star, CheckCircle, AlertTriangle, Zap, Users, HelpCircle } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';
import { useAuthStore } from '../../store/authStore';

// ─── Tooltip Component ───
const Tooltip = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-flex ml-1.5 align-middle">
            <button
                type="button"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={(e) => { e.preventDefault(); setShow(!show); }}
                className="text-gray-400 hover:text-gold transition-colors"
            >
                <HelpCircle className="w-4 h-4" />
            </button>
            {show && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-xs rounded-lg shadow-xl whitespace-normal w-56 text-center font-sans font-normal z-50 leading-relaxed">
                    {text}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-charcoal" />
                </span>
            )}
        </span>
    );
};

const PURITY_OPTIONS = [
    { value: '24K', label: '24K (99.9%)', factor: 0.999 },
    { value: '22K', label: '22K (91.6%)', factor: 0.916 },
    { value: '18K', label: '18K (75.0%)', factor: 0.750 },
    { value: '14K', label: '14K (58.5%)', factor: 0.585 },
];

const GOLD_TYPES = [
    { value: 'jewellery', label: '💍 Jewellery' },
    { value: 'coin', label: '🪙 Coin' },
    { value: 'bar', label: '🟨 Bar' },
];

const DURATION_OPTIONS = [
    { value: 24, label: '24 Hours' },
    { value: 48, label: '48 Hours' },
    { value: 72, label: '72 Hours' },
    { value: 168, label: '7 Days' },
];

const APPROX_GOLD_RATE = 7500; // ₹ per gram
const MIN_BID_INCREMENT = 500; // ₹

const MOCK_AUCTIONS = [
    {
        id: 'auc-001',
        sellerName: 'Priya Sharma',
        sellerPhone: '+91 9876543210',
        goldType: 'jewellery',
        purity: '22K',
        weight: 20,
        reservePrice: 120000,
        buyNowPrice: 145000,
        fulfillmentMethod: 'store_visit',
        location: 'Mumbai, Bandra',
        images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop'
        ],
        vendorOnly: false,
        status: 'live',
        endsAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        bids: [
            { id: 'bid-1', bidderName: 'Bidder #A1', amount: 122000, time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), isVendor: true },
            { id: 'bid-2', bidderName: 'Bidder #B3', amount: 125000, time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isVendor: false },
            { id: 'bid-3', bidderName: 'Bidder #C7', amount: 128000, time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), isVendor: true },
        ],
        qna: [
            { q: 'Is this hallmarked?', a: 'Yes, BIS hallmarked 22K', askedBy: 'Bidder #A1', answeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        id: 'auc-002',
        sellerName: 'Rajesh Kumar',
        sellerPhone: '+91 9123456789',
        goldType: 'coin',
        purity: '24K',
        weight: 10,
        reservePrice: 75000,
        buyNowPrice: null,
        fulfillmentMethod: 'shipping',
        location: 'Delhi',
        images: [
            'https://images.unsplash.com/photo-1610375228550-d5cabc1d4090?w=400&h=300&fit=crop',
        ],
        vendorOnly: false,
        status: 'live',
        endsAt: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        bids: [],
        qna: []
    },
    {
        id: 'auc-003',
        sellerName: 'Amit Patel',
        sellerPhone: '+91 9988776655',
        goldType: 'bar',
        purity: '24K',
        weight: 50,
        reservePrice: 370000,
        buyNowPrice: 390000,
        fulfillmentMethod: 'store_visit',
        location: 'Ahmedabad',
        images: [
            'https://images.unsplash.com/photo-1589787168422-6f6f0f5c4b16?w=400&h=300&fit=crop',
        ],
        vendorOnly: true,
        status: 'closed',
        endsAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
        bids: [
            { id: 'bid-4', bidderName: 'Bidder #D2', amount: 375000, time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), isVendor: true },
            { id: 'bid-5', bidderName: 'Bidder #E5', amount: 380000, time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isVendor: true },
        ],
        winner: { bidderName: 'Bidder #E5', amount: 380000 },
        qna: []
    }
];

// ─── Countdown Hook ───
function useCountdown(endsAt) {
    const calc = useCallback(() => {
        const diff = new Date(endsAt) - Date.now();
        if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 };
        return {
            h: Math.floor(diff / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            total: diff,
        };
    }, [endsAt]);
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [calc]);
    return time;
}

// ─── Countdown Badge ───
const CountdownBadge = ({ endsAt, size = 'sm' }) => {
    const t = useCountdown(endsAt);
    if (t.total <= 0) return <span className="text-sm font-bold text-red-600">Auction Ended</span>;
    const urgent = t.total < 3600000;
    const warning = t.total < 6 * 3600000;

    if (size === 'lg') {
        return (
            <div className={`flex items-center gap-1 ${urgent ? 'text-red-600' : warning ? 'text-amber-600' : 'text-charcoal'}`}>
                {[{ v: t.h, l: 'HRS' }, { v: t.m, l: 'MIN' }, { v: t.s, l: 'SEC' }].map((u, i) => (
                    <div key={u.l} className="flex items-center gap-1">
                        {i > 0 && <span className={`text-2xl font-bold ${urgent ? 'animate-pulse' : ''}`}>:</span>}
                        <div className="text-center">
                            <span className={`font-mono text-3xl font-black tabular-nums leading-none ${urgent ? 'animate-pulse' : ''}`}>
                                {String(u.v).padStart(2, '0')}
                            </span>
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-60 mt-0.5">{u.l}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <span className={`font-mono text-sm font-bold tabular-nums ${urgent ? 'text-red-600 animate-pulse' : 'text-white'}`}>
            {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
        </span>
    );
};

const getStatusConfig = (status) => {
    const map = {
        live: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Live', icon: Zap },
        closed: { color: 'bg-gray-200 text-gray-600 border-gray-300', label: 'Closed', icon: CheckCircle },
        pending_verification: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending Verification', icon: Shield },
        completed: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Completed', icon: CheckCircle },
        reserve_not_met: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Reserve Not Met', icon: AlertTriangle },
    };
    return map[status] || map.live;
};

// ─── Main Component ───
const GoldAuction = () => {
    const { user } = useAuthStore();

    const [auctions, setAuctions] = useState(() => {
        const saved = localStorage.getItem('gold_auctions');
        return saved ? JSON.parse(saved) : MOCK_AUCTIONS;
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [expandedAuction, setExpandedAuction] = useState(null);
    const [bidAmounts, setBidAmounts] = useState({});
    const [newQuestions, setNewQuestions] = useState({});
    const [tab, setTab] = useState('live'); // live | my | closed

    const [formData, setFormData] = useState({
        goldType: '', purity: '', weight: '', reservePrice: '', buyNowPrice: '',
        duration: 24, fulfillmentMethod: '', location: '', vendorOnly: false, images: []
    });

    const update = (newAuctions) => {
        setAuctions(newAuctions);
        localStorage.setItem('gold_auctions', JSON.stringify(newAuctions));
    };

    // Close expired auctions automatically
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            let changed = false;
            const updated = auctions.map(a => {
                if (a.status === 'live' && new Date(a.endsAt) <= now) {
                    changed = true;
                    const highBid = a.bids.length > 0 ? a.bids[a.bids.length - 1] : null;
                    const reserveMet = highBid && highBid.amount >= a.reservePrice;
                    return {
                        ...a,
                        status: reserveMet ? 'closed' : 'reserve_not_met',
                        ...(reserveMet ? { winner: { bidderName: highBid.bidderName, amount: highBid.amount } } : {})
                    };
                }
                return a;
            });
            if (changed) update(updated);
        }, 2000);
        return () => clearInterval(timer);
    }, [auctions]);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const indicativeValue = (() => {
        const w = parseFloat(formData.weight);
        const p = PURITY_OPTIONS.find(o => o.value === formData.purity);
        return w && p ? Math.round(w * APPROX_GOLD_RATE * p.factor) : null;
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.goldType || !formData.purity || !formData.weight || !formData.reservePrice || !formData.fulfillmentMethod || !formData.location) {
            alert('Please fill in all required fields'); return;
        }
        if (formData.images.length === 0) { alert('Please upload at least one image'); return; }

        const auction = {
            id: `auc-${Date.now()}`,
            sellerName: user?.name || 'Customer',
            sellerPhone: user?.phone || '+91 9000000000',
            goldType: formData.goldType,
            purity: formData.purity,
            weight: parseFloat(formData.weight),
            reservePrice: parseFloat(formData.reservePrice),
            buyNowPrice: formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null,
            fulfillmentMethod: formData.fulfillmentMethod,
            location: formData.location,
            vendorOnly: formData.vendorOnly,
            images: formData.images,
            status: 'live',
            endsAt: new Date(Date.now() + parseInt(formData.duration) * 3600000).toISOString(),
            createdAt: new Date().toISOString(),
            bids: [],
            qna: [],
        };
        update([auction, ...auctions]);
        setFormData({ goldType: '', purity: '', weight: '', reservePrice: '', buyNowPrice: '', duration: 24, fulfillmentMethod: '', location: '', vendorOnly: false, images: [] });
        setShowForm(false);
    };

    // Place bid (with anti-sniping)
    const placeBid = (auctionId) => {
        const amount = parseFloat(bidAmounts[auctionId]);
        if (!amount) { alert('Enter a bid amount'); return; }

        update(auctions.map(a => {
            if (a.id !== auctionId) return a;
            const currentHigh = a.bids.length > 0 ? a.bids[a.bids.length - 1].amount : a.reservePrice - MIN_BID_INCREMENT;
            if (amount < currentHigh + MIN_BID_INCREMENT) {
                alert(`Minimum bid is ₹${(currentHigh + MIN_BID_INCREMENT).toLocaleString()}`); return a;
            }
            // Anti-sniping: extend by 5 min if bid in last 5 min
            let newEndsAt = a.endsAt;
            if (new Date(a.endsAt) - Date.now() < 5 * 60 * 1000) {
                newEndsAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            }
            return {
                ...a,
                endsAt: newEndsAt,
                bids: [...a.bids, { id: `bid-${Date.now()}`, bidderName: `Bidder #${(user?.name || 'You').charAt(0)}${Math.floor(Math.random() * 9) + 1}`, amount, time: new Date().toISOString(), isVendor: false }]
            };
        }));
        setBidAmounts(b => ({ ...b, [auctionId]: '' }));
    };

    // Buy Now
    const buyNow = (auctionId) => {
        update(auctions.map(a => {
            if (a.id !== auctionId || !a.buyNowPrice) return a;
            return {
                ...a,
                status: 'closed',
                winner: { bidderName: user?.name || 'You', amount: a.buyNowPrice },
                bids: [...a.bids, { id: `bid-${Date.now()}`, bidderName: user?.name || 'You', amount: a.buyNowPrice, time: new Date().toISOString(), isVendor: false }]
            };
        }));
    };

    // Ask question
    const askQuestion = (auctionId) => {
        const q = newQuestions[auctionId];
        if (!q?.trim()) return;
        update(auctions.map(a => {
            if (a.id !== auctionId) return a;
            return { ...a, qna: [...a.qna, { q, a: null, askedBy: `Bidder #${(user?.name || 'U').charAt(0)}${Math.floor(Math.random() * 9) + 1}`, answeredAt: null }] };
        }));
        setNewQuestions(nq => ({ ...nq, [auctionId]: '' }));
    };

    // Answer question (seller)
    const answerQuestion = (auctionId, qIdx, answer) => {
        update(auctions.map(a => {
            if (a.id !== auctionId) return a;
            const qna = [...a.qna];
            qna[qIdx] = { ...qna[qIdx], a: answer, answeredAt: new Date().toISOString() };
            return { ...a, qna };
        }));
    };

    // Filter
    const filtered = auctions.filter(a => {
        if (tab === 'live') return a.status === 'live';
        if (tab === 'my') return a.sellerName === (user?.name || '');
        if (tab === 'closed') return ['closed', 'completed', 'reserve_not_met'].includes(a.status);
        return true;
    });

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 border-b border-gold/20 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal flex items-center gap-3">
                            <Gavel className="w-8 h-8 text-gold" /> Gold <span className="text-gold">Auction</span>
                        </h1>
                        <p className="text-gray-500 font-sans text-sm mt-1">Time-bound, sealed auctions for gold — bid or sell with confidence</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Create Auction</>}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[{ key: 'live', label: 'Live Auctions', icon: Zap }, { key: 'my', label: 'My Auctions', icon: Gavel }, { key: 'closed', label: 'Closed', icon: CheckCircle }].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border ${tab === t.key ? 'bg-gold text-white border-gold shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-gold'}`}>
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* ─── Create Auction Form ─── */}
                {showForm && (
                    <div className="mb-8 bg-white p-6 md:p-8 rounded-lg border-2 border-gold/30 shadow-xl">
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
                            <Gavel className="w-6 h-6 text-gold" /> Create Gold Auction
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Gold Type */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Gold Type <span className="text-red-500">*</span><Tooltip text="Select the form of gold you're auctioning — jewellery (necklace, ring, etc.), a minted coin, or a gold bar/biscuit." /></label>
                                    <select name="goldType" value={formData.goldType} onChange={handleInput} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" required>
                                        <option value="">Select type</option>
                                        {GOLD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                {/* Purity */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Purity <span className="text-red-500">*</span><Tooltip text="The karat rating of your gold. 24K is purest (99.9%), 22K (91.6%) is common for jewellery, 18K (75%) for studded pieces." /></label>
                                    <select name="purity" value={formData.purity} onChange={handleInput} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" required>
                                        <option value="">Select purity</option>
                                        {PURITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>
                                {/* Weight */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Est. Weight (g) <span className="text-red-500">*</span><Tooltip text="Approximate weight of your gold item in grams. This helps calculate the indicative market value shown below." /></label>
                                    <div className="relative">
                                        <input type="number" name="weight" value={formData.weight} onChange={handleInput} placeholder="25" min="0" step="0.1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans pr-16" required />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">grams</span>
                                    </div>
                                </div>
                                {/* Reserve Price */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Reserve Price <span className="text-red-500">*</span><Tooltip text="The minimum price you'll accept. This is hidden from bidders. If the highest bid doesn't reach this amount, the auction ends without a sale." /></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IndianRupee className="h-5 w-5 text-gray-400" /></div>
                                        <input type="number" name="reservePrice" value={formData.reservePrice} onChange={handleInput} placeholder={indicativeValue ? indicativeValue.toString() : '100000'} min="0" step="100" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" required />
                                    </div>
                                    {indicativeValue && <p className="text-xs text-gold-dark mt-1">💡 Market value ≈ ₹{indicativeValue.toLocaleString()}</p>}
                                </div>
                                {/* Buy Now (optional) */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Buy Now Price <span className="text-gray-400 font-normal">(optional)</span><Tooltip text="Set a fixed price at which a buyer can instantly purchase your gold without waiting for the auction to end. Leave blank to allow only bidding." /></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IndianRupee className="h-5 w-5 text-gray-400" /></div>
                                        <input type="number" name="buyNowPrice" value={formData.buyNowPrice} onChange={handleInput} placeholder="Instant sell price" min="0" step="100" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" />
                                    </div>
                                </div>
                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Auction Duration <span className="text-red-500">*</span><Tooltip text="How long the auction will stay live for bidding. Longer durations attract more bidders. Anti-sniping extends time if a bid is placed in the last 5 minutes." /></label>
                                    <select name="duration" value={formData.duration} onChange={handleInput} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans">
                                        {DURATION_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                    </select>
                                </div>
                                {/* Fulfillment */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Fulfillment <span className="text-red-500">*</span><Tooltip text="How the gold will be handed over after the sale — meet at a store, schedule a pickup at your location, or ship via insured courier." /></label>
                                    <select name="fulfillmentMethod" value={formData.fulfillmentMethod} onChange={handleInput} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" required>
                                        <option value="">Select method</option>
                                        <option value="store_visit">🏪 Store Visit</option>
                                        <option value="pickup">📦 Pickup</option>
                                        <option value="shipping">🚚 Shipping</option>
                                    </select>
                                </div>
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Location <span className="text-red-500">*</span><Tooltip text="Your city or area — helps buyers near you find your auction. Also used for store visit and pickup fulfillment." /></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                                        <input type="text" name="location" value={formData.location} onChange={handleInput} placeholder="Mumbai, Bandra" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" required />
                                    </div>
                                </div>
                                {/* Vendor Only */}
                                <div className="flex items-end">
                                    <label className="flex items-center gap-3 cursor-pointer py-3">
                                        <input type="checkbox" name="vendorOnly" checked={formData.vendorOnly} onChange={handleInput} className="w-5 h-5 accent-gold rounded" />
                                        <span className="text-sm font-serif font-semibold text-charcoal">Vendor-Only Auction<Tooltip text="When enabled, only verified vendors can bid on this auction. Regular customers won't see or be able to bid on it." /></span>
                                    </label>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">Photos <span className="text-red-500">*</span></label>
                                <ImageUpload images={formData.images} onChange={(imgs) => setFormData(f => ({ ...f, images: imgs }))} maxImages={5} />
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-700 font-sans leading-relaxed">
                                <strong>⚠️ Auction Rules:</strong> Once published, the auction cannot be cancelled. The reserve price is hidden from bidders. If the highest bid meets or exceeds the reserve, the auction will complete automatically. Minimum bid increment is ₹{MIN_BID_INCREMENT.toLocaleString()}.
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all">Publish Auction</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ─── Auction Cards ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map(auc => {
                        const st = getStatusConfig(auc.status);
                        const StIcon = st.icon;
                        const highBid = auc.bids.length > 0 ? auc.bids[auc.bids.length - 1] : null;
                        const isExpanded = expandedAuction === auc.id;
                        const minNext = highBid ? highBid.amount + MIN_BID_INCREMENT : auc.reservePrice;
                        const isMine = auc.sellerName === (user?.name || '');

                        return (
                            <div key={auc.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
                                {/* Image */}
                                {auc.images?.length > 0 && (
                                    <div className="relative">
                                        <div className="w-full h-56 bg-gray-100">
                                            <img src={selectedImage[auc.id] || auc.images[0]} alt={auc.goldType} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hb2xkIEl0ZW08L3RleHQ+PC9zdmc+'; }} />
                                        </div>
                                        {auc.images.length > 1 && (
                                            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                                                {auc.images.map((img, idx) => (
                                                    <button key={idx} onClick={() => setSelectedImage({ ...selectedImage, [auc.id]: img })} className={`flex-1 h-14 rounded-lg overflow-hidden border-2 transition-all ${(selectedImage[auc.id] || auc.images[0]) === img ? 'border-gold shadow-lg' : 'border-white/80 hover:border-gold/50'}`}>
                                                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+'; }} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${st.color}`}><StIcon className="w-3 h-3" /> {st.label}</span>
                                            {auc.vendorOnly && <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1"><Shield className="w-3 h-3" /> Vendors Only</span>}
                                        </div>
                                        {auc.status === 'live' && (
                                            <div className="absolute top-2 right-2 px-3 py-1.5 bg-black/80 text-white rounded-lg flex items-center gap-2 shadow-lg">
                                                <Clock className="w-4 h-4" />
                                                <CountdownBadge endsAt={auc.endsAt} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Prominent countdown strip */}
                                {auc.status === 'live' && (
                                    <div className={`px-5 py-3 flex items-center justify-between border-b ${(new Date(auc.endsAt) - Date.now()) < 3600000
                                        ? 'bg-red-50 border-red-200'
                                        : (new Date(auc.endsAt) - Date.now()) < 6 * 3600000
                                            ? 'bg-amber-50 border-amber-200'
                                            : 'bg-green-50 border-green-200'
                                        }`}>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                            <Clock className="w-4 h-4" /> Ends In
                                        </div>
                                        <CountdownBadge endsAt={auc.endsAt} size="lg" />
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Item summary */}
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h3 className="font-serif font-bold text-lg text-charcoal capitalize">{auc.goldType} — {auc.purity}</h3>
                                        <span className="text-xs text-gray-400">{auc.weight}g</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {auc.location}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {auc.bids.length} bid{auc.bids.length !== 1 ? 's' : ''}</span>
                                    </div>

                                    {/* Current bid / price */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{highBid ? 'Current Bid' : 'Starting At'}</p>
                                            <p className="font-serif font-bold text-xl text-gold">₹{(highBid?.amount || auc.reservePrice).toLocaleString()}</p>
                                        </div>
                                        {auc.buyNowPrice && auc.status === 'live' && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                                <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Buy Now</p>
                                                <p className="font-serif font-bold text-xl text-green-700">₹{auc.buyNowPrice.toLocaleString()}</p>
                                            </div>
                                        )}
                                        {!auc.buyNowPrice && (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Min Next Bid</p>
                                                <p className="font-serif font-bold text-xl text-gray-600">₹{minNext.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Winner banner */}
                                    {auc.winner && (
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-green-700">Won by {auc.winner.bidderName}</p>
                                                <p className="text-xs text-gray-600">₹{auc.winner.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reserve not met */}
                                    {auc.status === 'reserve_not_met' && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-red-700">Reserve Price Not Met</p>
                                                <p className="text-xs text-gray-600">{highBid ? `Highest bid ₹${highBid.amount.toLocaleString()}` : 'No bids received'}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bid section (live only, not own auction) */}
                                    {auc.status === 'live' && !isMine && (
                                        <div className="pt-4 border-t border-gray-100 space-y-3">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                                    <input
                                                        type="number" placeholder={minNext.toString()} value={bidAmounts[auc.id] || ''}
                                                        onChange={(e) => setBidAmounts(b => ({ ...b, [auc.id]: e.target.value }))}
                                                        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                                    />
                                                </div>
                                                <button onClick={() => placeBid(auc.id)} className="px-5 py-2.5 bg-black text-gold rounded-lg font-bold border-2 border-gold hover:shadow-lg transition-all flex items-center gap-2">
                                                    <Gavel className="w-4 h-4" /> Bid
                                                </button>
                                            </div>
                                            {auc.buyNowPrice && (
                                                <button onClick={() => { if (window.confirm(`Buy now for ₹${auc.buyNowPrice.toLocaleString()}?`)) buyNow(auc.id); }} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                                                    <Zap className="w-4 h-4" /> Buy Now — ₹{auc.buyNowPrice.toLocaleString()}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Expand toggle */}
                                    <button onClick={() => setExpandedAuction(isExpanded ? null : auc.id)} className="mt-4 w-full flex items-center justify-center gap-1 text-xs text-gold-dark hover:text-gold font-bold uppercase tracking-wider transition-colors py-2">
                                        {isExpanded ? <><ChevronUp className="w-4 h-4" /> Hide Details</> : <><ChevronDown className="w-4 h-4" /> Bid History & Q&A</>}
                                    </button>

                                    {/* Expanded: Bid History + Q&A */}
                                    {isExpanded && (
                                        <div className="mt-3 space-y-4">
                                            {/* Bid History */}
                                            <div>
                                                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Bid History ({auc.bids.length})</h4>
                                                {auc.bids.length > 0 ? (
                                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                        {[...auc.bids].reverse().map((bid, i) => (
                                                            <div key={bid.id} className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${i === 0 ? 'bg-gold/10 border border-gold/20' : 'bg-gray-50'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-charcoal">{bid.bidderName}</span>
                                                                    {bid.isVendor && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">VENDOR</span>}
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="font-serif font-bold text-gold">₹{bid.amount.toLocaleString()}</span>
                                                                    <p className="text-[10px] text-gray-400">{new Date(bid.time).toLocaleTimeString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p className="text-xs text-gray-400 italic">No bids yet</p>}
                                            </div>

                                            {/* Q&A */}
                                            <div>
                                                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Questions & Answers ({auc.qna.length})</h4>
                                                {auc.qna.length > 0 && (
                                                    <div className="space-y-2 mb-3">
                                                        {auc.qna.map((item, qi) => (
                                                            <div key={qi} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                                <p className="text-sm text-charcoal"><strong>Q:</strong> {item.q} <span className="text-[10px] text-gray-400 ml-1">— {item.askedBy}</span></p>
                                                                {item.a ? (
                                                                    <p className="text-sm text-gray-700 mt-1"><strong>A:</strong> {item.a}</p>
                                                                ) : isMine ? (
                                                                    <div className="mt-2 flex gap-2">
                                                                        <input id={`ans-${auc.id}-${qi}`} type="text" placeholder="Type your answer…" className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-gold" />
                                                                        <button onClick={() => { const el = document.getElementById(`ans-${auc.id}-${qi}`); if (el?.value) answerQuestion(auc.id, qi, el.value); }} className="px-3 py-1.5 bg-gold text-white rounded text-xs font-bold">Reply</button>
                                                                    </div>
                                                                ) : <p className="text-xs text-gray-400 italic mt-1">Awaiting seller response…</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {auc.status === 'live' && !isMine && (
                                                    <div className="flex gap-2">
                                                        <input type="text" placeholder="Ask the seller a question…" value={newQuestions[auc.id] || ''} onChange={(e) => setNewQuestions(nq => ({ ...nq, [auc.id]: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold" />
                                                        <button onClick={() => askQuestion(auc.id)} className="px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-bold flex items-center gap-1"><Send className="w-3 h-3" /> Ask</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-serif italic text-lg">No {tab} auctions found</p>
                        {tab === 'live' && <button onClick={() => setShowForm(true)} className="mt-4 px-8 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg font-bold transition-colors">Create Your First Auction</button>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoldAuction;
