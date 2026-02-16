import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

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

const PawnRequestsFeed = () => {
  // Initialize from localStorage or use MOCK_PAWNS as fallback
  const [pawns, setPawns] = useState(() => {
    const saved = localStorage.getItem('pawn_requests');
    return saved ? JSON.parse(saved) : MOCK_PAWNS;
  });

  const [offerInputs, setOfferInputs] = useState({});
  const [selectedImage, setSelectedImage] = useState({});

  // Save to localStorage whenever pawns change
  const updatePawns = (newPawns) => {
    setPawns(newPawns);
    localStorage.setItem('pawn_requests', JSON.stringify(newPawns));
  };

  const sendOffer = (pawnId) => {
    const offer = offerInputs[pawnId];
    if (!offer?.amount || !offer?.rate) {
      alert('Please enter both offer amount and interest rate');
      return;
    }

    updatePawns(pawns.map(p =>
      p.id === pawnId ? {
        ...p,
        status: 'offers_received',
        offers: [...p.offers, {
          vendorName: "Your Store",
          offeredAmount: parseFloat(offer.amount),
          interestRate: parseFloat(offer.rate)
        }]
      } : p
    ));

    // Clear inputs for this pawn
    setOfferInputs({ ...offerInputs, [pawnId]: {} });
  };

  const handleInputChange = (pawnId, field, value) => {
    setOfferInputs({
      ...offerInputs,
      [pawnId]: {
        ...offerInputs[pawnId],
        [field]: value
      }
    });
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone, customerName, itemType) => {
    const message = `Hi ${customerName}, I'm interested in your ${itemType} pawn request. Can we discuss the loan details?`;
    const phoneNumber = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gold/20 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
            Gold Pawn Requests
          </h1>
          <p className="text-gray-500 font-sans text-sm mt-1">
            Browse customer requests and send loan offers
          </p>
        </div>

        {/* Pawns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pawns.filter(p => p.status !== 'active_loan').map(pawn => (
            <div key={pawn.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden">
              {/* Image Gallery Section */}
              {pawn.images && pawn.images.length > 0 && (
                <div className="relative">
                  {/* Main Image */}
                  <div className="w-full h-64 bg-gray-100">
                    <img
                      src={selectedImage[pawn.id] || pawn.images[0]}
                      alt={`${pawn.itemType} - ${pawn.customerName}`}
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
                          className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
                  {/* Image count badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded">
                    {pawn.images.length} {pawn.images.length === 1 ? 'photo' : 'photos'}
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Customer info */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-serif font-bold text-lg text-charcoal">
                        {pawn.customerName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                        <span className="text-lg">{getItemEmoji(pawn.itemType)}</span>
                        {pawn.itemType} • {pawn.weight}g
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    📍 {pawn.location}
                  </p>
                </div>

                {/* Contact Actions */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => handleCall(pawn.customerPhone)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={() => handleWhatsApp(pawn.customerPhone, pawn.customerName, pawn.itemType)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-500 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>

                {/* Requested amount */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Requested Loan
                  </p>
                  <p className="font-serif font-bold text-2xl text-gold">
                    ₹{pawn.requestedAmount.toLocaleString()}
                  </p>
                </div>

                {/* Offer form or status */}
                {pawn.offers.length === 0 ? (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Offer Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="45000"
                          value={offerInputs[pawn.id]?.amount || ''}
                          onChange={(e) => handleInputChange(pawn.id, 'amount', e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Interest Rate (% per month)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="1.5"
                          value={offerInputs[pawn.id]?.rate || ''}
                          onChange={(e) => handleInputChange(pawn.id, 'rate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          %
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => sendOffer(pawn.id)}
                      className="w-full px-4 py-3 bg-black hover:bg-gray-900 text-gold rounded-lg font-bold border-2 border-gold shadow-lg hover:shadow-xl transition-all"
                    >
                      Send Offer
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 text-center">
                    <div className="py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-600 font-bold text-sm">
                        ✓ Offer Sent
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        ₹{pawn.offers[pawn.offers.length - 1].offeredAmount.toLocaleString()} at {pawn.offers[pawn.offers.length - 1].interestRate}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {pawns.filter(p => p.status !== 'active_loan').length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 font-serif italic">
              No pawn requests available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PawnRequestsFeed;
