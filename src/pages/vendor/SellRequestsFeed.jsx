import { useState } from 'react';
import { Phone, MessageCircle, Star, Scale, MapPin, Truck, Clock, CheckCircle } from 'lucide-react';

const MOCK_SELL_REQUESTS = [
    {
        id: 'sell-001',
        customerName: 'Priya Sharma',
        customerPhone: '+91 9876543210',
        itemType: 'necklace',
        purity: '22K',
        weight: 18.5,
        expectedPrice: 95000,
        fulfillmentMethod: 'store_visit',
        location: 'Mumbai, Andheri West',
        status: 'posted',
        images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop'
        ],
        offers: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sell-002',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 9123456789',
        itemType: 'ring',
        purity: '18K',
        weight: 8.2,
        expectedPrice: 35000,
        fulfillmentMethod: 'courier_pickup',
        location: 'Delhi, Connaught Place',
        status: 'offers_received',
        images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
        ],
        offers: [
            {
                vendorName: 'Golden Jewels',
                offeredPrice: 33000,
                verificationMethod: 'In-Store',
                timeline: 2,
                rating: 4.5
            }
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sell-003',
        customerName: 'Amit Patel',
        customerPhone: '+91 9988776655',
        itemType: 'bangle',
        purity: '24K',
        weight: 25.0,
        expectedPrice: 165000,
        fulfillmentMethod: 'store_visit',
        location: 'Ahmedabad, CG Road',
        status: 'sold',
        images: [
            'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop'
        ],
        offers: [
            {
                vendorName: 'Silver Palace',
                offeredPrice: 160000,
                verificationMethod: 'In-Store',
                timeline: 1,
                rating: 4.8
            }
        ],
        acceptedOffer: {
            vendorName: 'Silver Palace',
            offeredPrice: 160000
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];

const getItemEmoji = (itemType) => {
    const emojis = {
        ring: '💍',
        chain: '🔗',
        bangle: '📿',
        necklace: '📿',
        coin: '🪙',
        earring: '✨',
        other: '✨'
    };
    return emojis[itemType] || '✨';
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

const SellRequestsFeed = () => {
    // Load from localStorage (shared with customer page) or fall back to mock data
    const [sellRequests, setSellRequests] = useState(() => {
        const saved = localStorage.getItem('sell_requests');
        return saved ? JSON.parse(saved) : MOCK_SELL_REQUESTS;
    });

    const [offerInputs, setOfferInputs] = useState({});
    const [selectedImage, setSelectedImage] = useState({});
    const [filterPurity, setFilterPurity] = useState('all');
    const [filterMethod, setFilterMethod] = useState('all');

    const updateSellRequests = (newRequests) => {
        setSellRequests(newRequests);
        localStorage.setItem('sell_requests', JSON.stringify(newRequests));
    };

    const sendOffer = (requestId) => {
        const input = offerInputs[requestId];
        if (!input?.price || !input?.verificationMethod || !input?.timeline) {
            alert('Please fill in all offer fields (price, verification method, and timeline)');
            return;
        }

        const updatedRequests = sellRequests.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    status: 'offers_received',
                    offers: [
                        ...req.offers,
                        {
                            vendorName: 'Your Store',
                            offeredPrice: parseFloat(input.price),
                            verificationMethod: input.verificationMethod,
                            timeline: parseInt(input.timeline),
                            rating: 4.5
                        }
                    ]
                };
            }
            return req;
        });

        updateSellRequests(updatedRequests);
        setOfferInputs({ ...offerInputs, [requestId]: {} });
    };

    const handleInputChange = (requestId, field, value) => {
        setOfferInputs({
            ...offerInputs,
            [requestId]: {
                ...offerInputs[requestId],
                [field]: value
            }
        });
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (phone, customerName, itemType) => {
        const message = `Hi ${customerName}, I'm interested in purchasing your ${itemType}. I'd like to discuss the details and make an offer.`;
        const phoneNumber = phone.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Filter only active requests (not sold)
    const activeRequests = sellRequests.filter(req => {
        if (req.status === 'sold') return false;
        if (filterPurity !== 'all' && req.purity !== filterPurity) return false;
        if (filterMethod !== 'all' && req.fulfillmentMethod !== filterMethod) return false;
        return true;
    });

    // Check if current vendor already sent an offer
    const hasMyOffer = (req) => req.offers.some(o => o.vendorName === 'Your Store');

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 border-b border-gold/20 pb-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
                        Buy Gold — <span className="text-gold">Sell Requests</span>
                    </h1>
                    <p className="text-gray-500 font-sans text-sm mt-1">
                        Browse customer sell requests and make purchase offers
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-sans">Filter:</span>
                    <select
                        value={filterPurity}
                        onChange={(e) => setFilterPurity(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-sans bg-white focus:border-gold outline-none"
                    >
                        <option value="all">All Purities</option>
                        <option value="24K">24K</option>
                        <option value="22K">22K</option>
                        <option value="18K">18K</option>
                        <option value="14K">14K</option>
                    </select>
                    <select
                        value={filterMethod}
                        onChange={(e) => setFilterMethod(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-sans bg-white focus:border-gold outline-none"
                    >
                        <option value="all">All Methods</option>
                        <option value="store_visit">Store Visit</option>
                        <option value="courier_pickup">Courier Pickup</option>
                    </select>
                    <span className="ml-auto text-xs text-gray-400 font-sans">
                        {activeRequests.length} request{activeRequests.length !== 1 ? 's' : ''} available
                    </span>
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeRequests.map(req => (
                        <div key={req.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
                            {/* Image Gallery */}
                            {req.images && req.images.length > 0 && (
                                <div className="relative">
                                    <div className="w-full h-64 bg-gray-100">
                                        <img
                                            src={selectedImage[req.id] || req.images[0]}
                                            alt={`${req.itemType} - ${req.customerName}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hb2xkIEl0ZW08L3RleHQ+PC9zdmc+';
                                            }}
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    {req.images.length > 1 && (
                                        <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                                            {req.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImage({ ...selectedImage, [req.id]: img })}
                                                    className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${(selectedImage[req.id] || req.images[0]) === img
                                                            ? 'border-gold shadow-lg'
                                                            : 'border-white/80 hover:border-gold/50'
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+';
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {/* Badges */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPurityBadge(req.purity)}`}>
                                            {req.purity}
                                        </span>
                                    </div>
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded">
                                        {req.images.length} {req.images.length === 1 ? 'photo' : 'photos'}
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Customer Info */}
                                <div className="mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-serif font-bold text-lg text-charcoal">
                                                {req.customerName}
                                            </p>
                                            <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                                                <span className="text-lg">{getItemEmoji(req.itemType)}</span>
                                                {req.itemType} • {req.weight}g
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-3 h-3" /> {req.fulfillmentMethod === 'store_visit' ? 'Store Visit' : 'Courier Pickup'}
                                        </span>
                                    </div>
                                </div>

                                {/* Contact Actions */}
                                <div className="mb-4 flex gap-2">
                                    <button
                                        onClick={() => handleCall(req.customerPhone)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </button>
                                    <button
                                        onClick={() => handleWhatsApp(req.customerPhone, req.customerName, req.itemType)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-500 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors text-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </button>
                                </div>

                                {/* Expected Price */}
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                <Scale className="w-3 h-3" /> Customer's Expected Price
                                            </p>
                                            <p className="font-serif font-bold text-2xl text-gold">
                                                ₹{req.expectedPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">{req.weight}g × {req.purity}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Offer Form or Status */}
                                {!hasMyOffer(req) ? (
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-charcoal uppercase tracking-wider">Make an Offer</p>

                                        {/* Offered Price */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Your Offer Price
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder={Math.round(req.expectedPrice * 0.9).toString()}
                                                    value={offerInputs[req.id]?.price || ''}
                                                    onChange={(e) => handleInputChange(req.id, 'price', e.target.value)}
                                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                                />
                                            </div>
                                        </div>

                                        {/* Verification Method */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Verification Method
                                            </label>
                                            <select
                                                value={offerInputs[req.id]?.verificationMethod || ''}
                                                onChange={(e) => handleInputChange(req.id, 'verificationMethod', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans text-sm"
                                            >
                                                <option value="">Select method</option>
                                                <option value="In-Store">🏪 In-Store Verification</option>
                                                <option value="Courier Pickup">📦 Courier Pickup + Lab Test</option>
                                            </select>
                                        </div>

                                        {/* Timeline */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Timeline (days to complete)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="30"
                                                    placeholder="2"
                                                    value={offerInputs[req.id]?.timeline || ''}
                                                    onChange={(e) => handleInputChange(req.id, 'timeline', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">days</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => sendOffer(req.id)}
                                            className="w-full px-4 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Send Offer
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-gray-100 text-center">
                                        <div className="py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                            <span className="text-green-600 font-bold text-sm">Offer Sent</span>
                                            {(() => {
                                                const myOffer = req.offers.find(o => o.vendorName === 'Your Store');
                                                return myOffer ? (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        ₹{myOffer.offeredPrice.toLocaleString()} • {myOffer.verificationMethod} • {myOffer.timeline} day{myOffer.timeline > 1 ? 's' : ''}
                                                    </p>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {activeRequests.length === 0 && (
                    <div className="text-center py-16">
                        <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-serif italic text-lg">
                            No sell requests available
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Check back later for new customer sell requests
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellRequestsFeed;
