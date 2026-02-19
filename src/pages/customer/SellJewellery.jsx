import { useState } from 'react';
import { Plus, X, IndianRupee, Gem, Scale, MapPin, Truck, CheckCircle, Clock, Star } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';
import { useAuthStore } from '../../store/authStore';

const PURITY_OPTIONS = [
    { value: '24K', label: '24K (99.9%)', factor: 0.999 },
    { value: '22K', label: '22K (91.6%)', factor: 0.916 },
    { value: '18K', label: '18K (75.0%)', factor: 0.750 },
    { value: '14K', label: '14K (58.5%)', factor: 0.585 },
];

const FULFILLMENT_OPTIONS = [
    { value: 'store_visit', label: '🏪 Store Visit', desc: 'Visit a vendor store for verification' },
    { value: 'courier_pickup', label: '📦 Courier Pickup', desc: 'Schedule a pickup from your location' },
];

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
            },
            {
                vendorName: 'Royal Gold Exchange',
                offeredPrice: 34500,
                verificationMethod: 'Courier Pickup',
                timeline: 3,
                rating: 4.2
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

const getStatusConfig = (status) => {
    const configs = {
        posted: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Awaiting Offers', icon: Clock },
        offers_received: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Offers Received', icon: Star },
        sold: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Sold', icon: CheckCircle }
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', label: status, icon: Clock };
};

// Approximate gold rate per gram (INR) — used for indicative pricing
const APPROX_GOLD_RATE_PER_GRAM = 7500;

const SellJewellery = () => {
    const { user } = useAuthStore();

    const [sellRequests, setSellRequests] = useState(() => {
        const saved = localStorage.getItem('sell_requests');
        return saved ? JSON.parse(saved) : MOCK_SELL_REQUESTS;
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [formData, setFormData] = useState({
        itemType: '',
        purity: '',
        weight: '',
        expectedPrice: '',
        fulfillmentMethod: '',
        location: '',
        images: []
    });

    const updateSellRequests = (newRequests) => {
        setSellRequests(newRequests);
        localStorage.setItem('sell_requests', JSON.stringify(newRequests));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImagesChange = (newImages) => {
        setFormData({ ...formData, images: newImages });
    };

    // Compute indicative price
    const getIndicativePrice = () => {
        const weight = parseFloat(formData.weight);
        const purityOption = PURITY_OPTIONS.find(p => p.value === formData.purity);
        if (!weight || !purityOption) return null;
        return Math.round(weight * APPROX_GOLD_RATE_PER_GRAM * purityOption.factor);
    };

    const indicativePrice = getIndicativePrice();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.itemType || !formData.purity || !formData.weight || !formData.expectedPrice || !formData.fulfillmentMethod || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.images.length === 0) {
            alert('Please upload at least one image of your jewellery');
            return;
        }

        const newRequest = {
            id: `sell-${Date.now()}`,
            customerName: user?.name || 'Customer',
            customerPhone: user?.phone || '+91 9000000000',
            itemType: formData.itemType,
            purity: formData.purity,
            weight: parseFloat(formData.weight),
            expectedPrice: parseFloat(formData.expectedPrice),
            fulfillmentMethod: formData.fulfillmentMethod,
            location: formData.location,
            images: formData.images,
            status: 'posted',
            offers: [],
            createdAt: new Date().toISOString()
        };

        updateSellRequests([newRequest, ...sellRequests]);

        setFormData({
            itemType: '',
            purity: '',
            weight: '',
            expectedPrice: '',
            fulfillmentMethod: '',
            location: '',
            images: []
        });
        setShowForm(false);
    };

    const acceptOffer = (requestId, offerIndex) => {
        updateSellRequests(sellRequests.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    status: 'sold',
                    acceptedOffer: req.offers[offerIndex]
                };
            }
            return req;
        }));
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 border-b border-gold/20 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
                            Sell Your <span className="text-gold">Jewellery</span>
                        </h1>
                        <p className="text-gray-500 font-sans text-sm mt-1">
                            List your gold items and receive competitive offers from verified vendors
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        {showForm ? (
                            <>
                                <X className="w-5 h-5" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                New Sell Request
                            </>
                        )}
                    </button>
                </div>

                {/* Live Gold Rate Banner */}
                <div className="mb-6 bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border border-gold/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                            <Scale className="w-5 h-5 text-gold-dark" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-sans">Indicative Gold Rate</p>
                            <p className="font-serif font-bold text-lg text-charcoal">₹{APPROX_GOLD_RATE_PER_GRAM.toLocaleString()}/g <span className="text-xs font-sans font-normal text-gray-400">(24K)</span></p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-sans max-w-xs text-right hidden sm:block">
                        Final price determined after physical verification by vendor
                    </p>
                </div>

                {/* New Sell Request Form */}
                {showForm && (
                    <div className="mb-8 bg-white p-6 md:p-8 rounded-lg border-2 border-gold/30 shadow-xl">
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
                            <Gem className="w-6 h-6 text-gold" />
                            Create Sell Request
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Item Type */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Item Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="itemType"
                                        value={formData.itemType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans capitalize"
                                        required
                                    >
                                        <option value="">Select item type</option>
                                        <option value="ring">💍 Ring</option>
                                        <option value="chain">🔗 Chain</option>
                                        <option value="necklace">📿 Necklace</option>
                                        <option value="bangle">📿 Bangle</option>
                                        <option value="earring">✨ Earring</option>
                                        <option value="coin">🪙 Coin</option>
                                        <option value="other">✨ Other</option>
                                    </select>
                                </div>

                                {/* Purity */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Estimated Purity <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="purity"
                                        value={formData.purity}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                        required
                                    >
                                        <option value="">Select purity</option>
                                        {PURITY_OPTIONS.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Approximate Weight (grams) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            placeholder="15.5"
                                            min="0"
                                            step="0.1"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans pr-16"
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">
                                            grams
                                        </span>
                                    </div>
                                </div>

                                {/* Fulfillment Method */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Fulfillment Method <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="fulfillmentMethod"
                                        value={formData.fulfillmentMethod}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                        required
                                    >
                                        <option value="">Select method</option>
                                        {FULFILLMENT_OPTIONS.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Expected Price */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Expected Price <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IndianRupee className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="expectedPrice"
                                            value={formData.expectedPrice}
                                            onChange={handleInputChange}
                                            placeholder={indicativePrice ? indicativePrice.toString() : '50000'}
                                            min="0"
                                            step="100"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                            required
                                        />
                                    </div>
                                    {indicativePrice && (
                                        <p className="text-xs text-gold-dark mt-1 font-sans">
                                            💡 Indicative value: ₹{indicativePrice.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Mumbai, Andheri West"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Indicative Price Banner */}
                            {indicativePrice && (
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Scale className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-serif font-bold text-amber-800">
                                                Estimated Value: ₹{indicativePrice.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-amber-600 mt-1 font-sans">
                                                Based on {formData.purity} purity × {formData.weight}g at ₹{APPROX_GOLD_RATE_PER_GRAM.toLocaleString()}/g.
                                                Final price will be determined after physical verification by the vendor.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Upload Jewellery Photos <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-3 font-sans">
                                    Upload 1–5 clear photos showing your jewellery from different angles
                                </p>
                                <ImageUpload
                                    images={formData.images}
                                    onChange={handleImagesChange}
                                    maxImages={5}
                                />
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                                    ⚠️ <strong>Price Disclaimer:</strong> The indicative price is an estimate based on current market rates and declared purity.
                                    The actual offer from vendors may vary based on physical verification, hallmark certification, and market conditions at the time of sale.
                                    By submitting, you agree to have your item verified by the selected vendor.
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({
                                            itemType: '',
                                            purity: '',
                                            weight: '',
                                            expectedPrice: '',
                                            fulfillmentMethod: '',
                                            location: '',
                                            images: []
                                        });
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-sans font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Submit Sell Request
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sell Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellRequests.map(req => {
                        const statusConfig = getStatusConfig(req.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                            <div key={req.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
                                {/* Image Gallery */}
                                {req.images && req.images.length > 0 && (
                                    <div className="relative">
                                        <div className="w-full h-48 bg-gray-100">
                                            <img
                                                src={selectedImage[req.id] || req.images[0]}
                                                alt={`${req.itemType}`}
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
                                                        className={`flex-1 h-12 rounded-lg overflow-hidden border-2 transition-all ${(selectedImage[req.id] || req.images[0]) === img
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
                                        {/* Status Badge */}
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.color} flex items-center gap-1`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Item Details */}
                                    <div className="mb-3">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <p className="font-serif font-bold text-2xl text-gold">
                                                ₹{req.expectedPrice.toLocaleString()}
                                            </p>
                                            <span className="text-xs text-gray-400 font-sans">{req.purity}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 capitalize">
                                            <span className="font-semibold">{getItemEmoji(req.itemType)} {req.itemType}</span> • {req.weight}g
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {req.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> {req.fulfillmentMethod === 'store_visit' ? 'Store Visit' : 'Courier Pickup'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Offers Section */}
                                    {req.offers.length > 0 && req.status !== 'sold' && (
                                        <div className="mt-4 space-y-3">
                                            <p className="text-xs text-blue-700 font-bold uppercase tracking-wide flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {req.offers.length} Vendor {req.offers.length === 1 ? 'Offer' : 'Offers'}
                                            </p>
                                            {req.offers.map((offer, idx) => (
                                                <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="text-sm font-bold text-charcoal">{offer.vendorName}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {offer.verificationMethod} • {offer.timeline} day{offer.timeline > 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                        <p className="font-serif font-bold text-lg text-gold">₹{offer.offeredPrice.toLocaleString()}</p>
                                                    </div>
                                                    {offer.rating && (
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                            <span className="text-xs text-gray-600">{offer.rating}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => acceptOffer(req.id, idx)}
                                                        className="w-full px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg font-bold text-sm transition-colors"
                                                    >
                                                        Accept Offer
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sold state */}
                                    {req.status === 'sold' && req.acceptedOffer && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                            <span className="text-green-600 font-bold text-sm">Sold to {req.acceptedOffer.vendorName}</span>
                                            <p className="text-xs text-gray-600 mt-1">₹{req.acceptedOffer.offeredPrice.toLocaleString()}</p>
                                        </div>
                                    )}

                                    {/* Waiting state */}
                                    {req.offers.length === 0 && req.status === 'posted' && (
                                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                                            <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                                            <p className="text-xs text-amber-700 font-semibold">
                                                Waiting for vendor offers…
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Vendors in your area will be notified</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {sellRequests.length === 0 && (
                    <div className="text-center py-16">
                        <Gem className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-serif italic mb-4 text-lg">
                            No sell requests yet
                        </p>
                        <p className="text-gray-400 text-sm mb-6">List your gold jewellery to receive offers from verified vendors</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-8 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg font-bold transition-colors"
                        >
                            Create Your First Sell Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellJewellery;
