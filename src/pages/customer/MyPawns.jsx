import { useState } from 'react';
import { Plus, X, IndianRupee } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';
import { useAuthStore } from '../../store/authStore';

const MOCK_PAWNS = [
  {
    id: "pawn-001",
    customerName: "Priya Sharma",
    customerPhone: "+91 9876543210",
    itemType: "chain",
    weight: 15.5,
    requestedAmount: 30000,
    location: "Mumbai",
    status: "posted",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop"
    ],
    offers: []
  },
  {
    id: "pawn-002",
    customerName: "Rajesh Kumar",
    customerPhone: "+91 9123456789",
    itemType: "ring",
    weight: 8.2,
    requestedAmount: 50000,
    location: "Delhi",
    status: "offers_received",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop"
    ],
    offers: [
      {
        vendorName: "Golden Jewels",
        offeredAmount: 48000,
        interestRate: 1.5
      }
    ]
  },
  {
    id: "pawn-003",
    customerName: "Amit Patel",
    customerPhone: "+91 9988776655",
    itemType: "bangle",
    weight: 25.0,
    requestedAmount: 80000,
    location: "Ahmedabad",
    status: "active_loan",
    images: [
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop"
    ],
    offers: [
      {
        vendorName: "Silver Palace",
        offeredAmount: 75000,
        interestRate: 1.2
      }
    ],
    acceptedOffer: {
      vendorName: "Silver Palace",
      offeredAmount: 75000
    }
  }
];

const getItemEmoji = (itemType) => {
  const emojis = {
    ring: '💍',
    chain: '🔗',
    bangle: '📿',
    coin: '🪙',
    other: '✨'
  };
  return emojis[itemType] || '✨';
};

const getStatusColor = (status) => {
  const colors = {
    posted: 'bg-yellow-100 text-yellow-700',
    offers_received: 'bg-blue-100 text-blue-700',
    active_loan: 'bg-green-100 text-green-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const MyPawns = () => {
  const { user } = useAuthStore();

  // Initialize from localStorage or use MOCK_PAWNS as fallback
  const [pawns, setPawns] = useState(() => {
    const saved = localStorage.getItem('pawn_requests');
    return saved ? JSON.parse(saved) : MOCK_PAWNS;
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [formData, setFormData] = useState({
    itemType: '',
    weight: '',
    requestedAmount: '',
    location: '',
    images: []
  });

  // Save to localStorage whenever pawns change
  const updatePawns = (newPawns) => {
    setPawns(newPawns);
    localStorage.setItem('pawn_requests', JSON.stringify(newPawns));
  };

  const acceptOffer = (pawnId) => {
    updatePawns(pawns.map(p =>
      p.id === pawnId ? { ...p, status: 'active_loan' } : p
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagesChange = (newImages) => {
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.itemType || !formData.weight || !formData.requestedAmount || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // Create new pawn request
    const newPawn = {
      id: `pawn-${Date.now()}`,
      customerName: user?.name || "Customer",
      itemType: formData.itemType,
      weight: parseFloat(formData.weight),
      requestedAmount: parseFloat(formData.requestedAmount),
      location: formData.location,
      images: formData.images,
      status: "posted",
      offers: []
    };

    updatePawns([newPawn, ...pawns]);

    // Reset form
    setFormData({
      itemType: '',
      weight: '',
      requestedAmount: '',
      location: '',
      images: []
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gold/20 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
              My Gold Pawn Requests
            </h1>
            <p className="text-gray-500 font-sans text-sm mt-1">
              View your pawn requests and loan offers
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
                New Request
              </>
            )}
          </button>
        </div>

        {/* New Pawn Request Form */}
        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg border-2 border-gold/30 shadow-xl">
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
              Create New Pawn Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="bangle">📿 Bangle</option>
                    <option value="coin">🪙 Coin</option>
                    <option value="other">✨ Other</option>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">
                      grams
                    </span>
                  </div>
                </div>

                {/* Requested Amount */}
                <div>
                  <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                    Requested Loan Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="requestedAmount"
                      value={formData.requestedAmount}
                      onChange={handleInputChange}
                      placeholder="50000"
                      min="0"
                      step="1000"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                    Location (City/Area) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai, Andheri"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                  Upload Gold Item Photos <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload 1-5 clear photos of your gold item
                </p>
                <ImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      itemType: '',
                      weight: '',
                      requestedAmount: '',
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pawns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pawns.map(pawn => (
            <div key={pawn.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
              {/* Image Gallery Section */}
              {pawn.images && pawn.images.length > 0 && (
                <div className="relative">
                  {/* Main Image */}
                  <div className="w-full h-48 bg-gray-100">
                    <img
                      src={selectedImage[pawn.id] || pawn.images[0]}
                      alt={`${pawn.itemType}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hb2xkIEl0ZW08L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  {/* Image Thumbnails */}
                  {pawn.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                      {pawn.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage({ ...selectedImage, [pawn.id]: img })}
                          className={`flex-1 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            (selectedImage[pawn.id] || pawn.images[0]) === img
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
                  {/* Status badge overlay */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(pawn.status)}`}>
                      {pawn.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Header with emoji (only if no images) */}
                {(!pawn.images || pawn.images.length === 0) && (
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">{getItemEmoji(pawn.itemType)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(pawn.status)}`}>
                      {pawn.status.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {/* Item details */}
                <div className="mb-4">
                  <p className="font-serif font-bold text-2xl text-gold mb-2">
                    ₹{pawn.requestedAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    <span className="font-semibold">{getItemEmoji(pawn.itemType)} {pawn.itemType}</span> • {pawn.weight}g
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {pawn.location}
                  </p>
                </div>

              {/* Offers section */}
              {pawn.offers.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wide mb-2">
                    Loan Offer
                  </p>
                  <p className="text-sm text-gray-800 mb-1">
                    <strong className="text-gold">₹{pawn.offers[0].offeredAmount.toLocaleString()}</strong>
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    {pawn.offers[0].interestRate}% interest • {pawn.offers[0].vendorName}
                  </p>
                  {pawn.status !== 'active_loan' && (
                    <button
                      onClick={() => acceptOffer(pawn.id)}
                      className="w-full px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg font-bold text-sm transition-colors"
                    >
                      Accept Offer
                    </button>
                  )}
                  {pawn.status === 'active_loan' && (
                    <div className="text-center py-2">
                      <span className="text-green-600 font-bold text-sm">✓ Loan Active</span>
                    </div>
                  )}
                </div>
              )}

              {/* No offers state */}
              {pawn.offers.length === 0 && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-xs text-gray-500">
                    Waiting for vendor offers...
                  </p>
                </div>
              )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state (if no pawns) */}
        {pawns.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 font-serif italic mb-4">
              No pawn requests yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg font-bold transition-colors"
            >
              Create Your First Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPawns;
