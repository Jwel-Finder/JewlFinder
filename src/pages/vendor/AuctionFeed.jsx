import { useState, useEffect, useCallback } from 'react';
import { Phone, MessageCircle, Gavel, Scale, MapPin, Clock, Shield, ChevronDown, ChevronUp, Send, CheckCircle, AlertTriangle, Zap, Users, IndianRupee } from 'lucide-react';

const PURITY_OPTIONS = [
    { value: '24K', factor: 0.999 },
    { value: '22K', factor: 0.916 },
    { value: '18K', factor: 0.750 },
    { value: '14K', factor: 0.585 },
];

const MIN_BID_INCREMENT = 500;

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

const getPurityBadge = (purity) => {
    const badges = {
        '24K': 'bg-amber-100 text-amber-800 border-amber-300',
        '22K': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        '18K': 'bg-orange-100 text-orange-800 border-orange-300',
        '14K': 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return badges[purity] || 'bg-gray-100 text-gray-700 border-gray-300';
};

// ─── Vendor Auction Feed ───
const AuctionFeed = () => {
    const [auctions, setAuctions] = useState(() => {
        const saved = localStorage.getItem('gold_auctions');
        return saved ? JSON.parse(saved) : MOCK_AUCTIONS;
    });

    const [bidAmounts, setBidAmounts] = useState({});
    const [selectedImage, setSelectedImage] = useState({});
    const [expandedAuction, setExpandedAuction] = useState(null);
    const [newQuestions, setNewQuestions] = useState({});
    const [filterPurity, setFilterPurity] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [tab, setTab] = useState('live');

    const update = (newAuctions) => {
        setAuctions(newAuctions);
        localStorage.setItem('gold_auctions', JSON.stringify(newAuctions));
    };

    // Auto-close expired auctions
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

    const placeBid = (auctionId) => {
        const amount = parseFloat(bidAmounts[auctionId]);
        if (!amount) { alert('Enter a bid amount'); return; }

        update(auctions.map(a => {
            if (a.id !== auctionId) return a;
            const currentHigh = a.bids.length > 0 ? a.bids[a.bids.length - 1].amount : a.reservePrice - MIN_BID_INCREMENT;
            if (amount < currentHigh + MIN_BID_INCREMENT) {
                alert(`Minimum bid is ₹${(currentHigh + MIN_BID_INCREMENT).toLocaleString()}`); return a;
            }
            // Anti-sniping
            let newEndsAt = a.endsAt;
            if (new Date(a.endsAt) - Date.now() < 5 * 60 * 1000) {
                newEndsAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            }
            return {
                ...a,
                endsAt: newEndsAt,
                bids: [...a.bids, { id: `bid-${Date.now()}`, bidderName: `Vendor #V${Math.floor(Math.random() * 9) + 1}`, amount, time: new Date().toISOString(), isVendor: true }]
            };
        }));
        setBidAmounts(b => ({ ...b, [auctionId]: '' }));
    };

    const buyNow = (auctionId) => {
        update(auctions.map(a => {
            if (a.id !== auctionId || !a.buyNowPrice) return a;
            return {
                ...a,
                status: 'closed',
                winner: { bidderName: 'Your Store', amount: a.buyNowPrice },
                bids: [...a.bids, { id: `bid-${Date.now()}`, bidderName: 'Your Store', amount: a.buyNowPrice, time: new Date().toISOString(), isVendor: true }]
            };
        }));
    };

    const askQuestion = (auctionId) => {
        const q = newQuestions[auctionId];
        if (!q?.trim()) return;
        update(auctions.map(a => {
            if (a.id !== auctionId) return a;
            return { ...a, qna: [...a.qna, { q, a: null, askedBy: `Vendor #V${Math.floor(Math.random() * 9) + 1}`, answeredAt: null }] };
        }));
        setNewQuestions(nq => ({ ...nq, [auctionId]: '' }));
    };

    const handleCall = (phone) => { window.location.href = `tel:${phone}`; };
    const handleWhatsApp = (phone, name, goldType) => {
        const msg = `Hi ${name}, I'm interested in your ${goldType} listing on JewlFinder Auction. I'd like to discuss further.`;
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // Check if vendor already has a bid
    const hasMyBid = (auc) => auc.bids.some(b => b.bidderName.startsWith('Vendor #') || b.bidderName === 'Your Store');

    // Filter
    const filtered = auctions.filter(a => {
        if (tab === 'live' && a.status !== 'live') return false;
        if (tab === 'closed' && !['closed', 'completed', 'reserve_not_met'].includes(a.status)) return false;
        if (filterPurity !== 'all' && a.purity !== filterPurity) return false;
        if (filterType !== 'all' && a.goldType !== filterType) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 border-b border-gold/20 pb-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal flex items-center gap-3">
                        <Gavel className="w-8 h-8 text-gold" /> Gold <span className="text-gold">Auctions</span>
                    </h1>
                    <p className="text-gray-500 font-sans text-sm mt-1">Browse live auctions, place competitive bids, and purchase gold</p>
                </div>

                {/* Tabs + Filters */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                    {[{ key: 'live', label: 'Live', icon: Zap }, { key: 'closed', label: 'Closed', icon: CheckCircle }].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border ${tab === t.key ? 'bg-gold text-white border-gold shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-gold'}`}>
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                    <div className="ml-auto flex gap-2">
                        <select value={filterPurity} onChange={(e) => setFilterPurity(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-sans bg-white focus:border-gold outline-none">
                            <option value="all">All Purities</option>
                            <option value="24K">24K</option><option value="22K">22K</option><option value="18K">18K</option><option value="14K">14K</option>
                        </select>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-sans bg-white focus:border-gold outline-none">
                            <option value="all">All Types</option>
                            <option value="jewellery">Jewellery</option><option value="coin">Coin</option><option value="bar">Bar</option>
                        </select>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mb-4">{filtered.length} auction{filtered.length !== 1 ? 's' : ''}</p>

                {/* Auction Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map(auc => {
                        const st = getStatusConfig(auc.status);
                        const StIcon = st.icon;
                        const highBid = auc.bids.length > 0 ? auc.bids[auc.bids.length - 1] : null;
                        const isExpanded = expandedAuction === auc.id;
                        const minNext = highBid ? highBid.amount + MIN_BID_INCREMENT : auc.reservePrice;

                        return (
                            <div key={auc.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
                                {/* Image */}
                                {auc.images?.length > 0 && (
                                    <div className="relative">
                                        <div className="w-full h-64 bg-gray-100">
                                            <img src={selectedImage[auc.id] || auc.images[0]} alt={auc.goldType} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hb2xkIEl0ZW08L3RleHQ+PC9zdmc+'; }} />
                                        </div>
                                        {auc.images.length > 1 && (
                                            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                                                {auc.images.map((img, idx) => (
                                                    <button key={idx} onClick={() => setSelectedImage({ ...selectedImage, [auc.id]: img })} className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${(selectedImage[auc.id] || auc.images[0]) === img ? 'border-gold shadow-lg' : 'border-white/80 hover:border-gold/50'}`}>
                                                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+'; }} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${st.color}`}><StIcon className="w-3 h-3" /> {st.label}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPurityBadge(auc.purity)}`}>{auc.purity}</span>
                                            {auc.vendorOnly && <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1"><Shield className="w-3 h-3" /> Vendors Only</span>}
                                        </div>
                                        {auc.status === 'live' && (
                                            <div className="absolute top-2 right-2 px-3 py-1.5 bg-black/80 text-white rounded-lg flex items-center gap-2 shadow-lg">
                                                <Clock className="w-4 h-4" /> <CountdownBadge endsAt={auc.endsAt} />
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

                                <div className="p-6">
                                    {/* Seller + Item Info */}
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-serif font-bold text-lg text-charcoal">{auc.sellerName}</p>
                                                <p className="text-sm text-gray-600 capitalize">{auc.goldType} • {auc.weight}g</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" /> {new Date(auc.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {auc.location}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {auc.bids.length} bid{auc.bids.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div className="mb-4 flex gap-2">
                                        <button onClick={() => handleCall(auc.sellerPhone)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm">
                                            <Phone className="w-4 h-4" /> Call
                                        </button>
                                        <button onClick={() => handleWhatsApp(auc.sellerPhone, auc.sellerName, auc.goldType)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-500 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors text-sm">
                                            <MessageCircle className="w-4 h-4" /> WhatsApp
                                        </button>
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{highBid ? 'Current Bid' : 'Starting At'}</p>
                                            <p className="font-serif font-bold text-xl text-gold">₹{(highBid?.amount || auc.reservePrice).toLocaleString()}</p>
                                        </div>
                                        {auc.buyNowPrice && auc.status === 'live' ? (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                                <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Buy Now</p>
                                                <p className="font-serif font-bold text-xl text-green-700">₹{auc.buyNowPrice.toLocaleString()}</p>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Min Next Bid</p>
                                                <p className="font-serif font-bold text-xl text-gray-600">₹{minNext.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Winner */}
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

                                    {/* Bid section (live) */}
                                    {auc.status === 'live' && (
                                        <div className="pt-4 border-t border-gray-100 space-y-3">
                                            <p className="text-xs font-bold text-charcoal uppercase tracking-wider">Place Your Bid</p>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                                    <input type="number" placeholder={minNext.toString()} value={bidAmounts[auc.id] || ''} onChange={(e) => setBidAmounts(b => ({ ...b, [auc.id]: e.target.value }))} className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans" />
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

                                    {/* Expanded */}
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
                                                ) : <p className="text-xs text-gray-400 italic">No bids yet — be the first!</p>}
                                            </div>

                                            {/* Q&A */}
                                            <div>
                                                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Questions & Answers ({auc.qna.length})</h4>
                                                {auc.qna.map((item, qi) => (
                                                    <div key={qi} className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-2">
                                                        <p className="text-sm text-charcoal"><strong>Q:</strong> {item.q} <span className="text-[10px] text-gray-400 ml-1">— {item.askedBy}</span></p>
                                                        {item.a ? <p className="text-sm text-gray-700 mt-1"><strong>A:</strong> {item.a}</p> : <p className="text-xs text-gray-400 italic mt-1">Awaiting seller response…</p>}
                                                    </div>
                                                ))}
                                                {auc.status === 'live' && (
                                                    <div className="flex gap-2 mt-2">
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
                        <p className="text-gray-400 text-sm mt-2">Check back later for new gold auctions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionFeed;
