import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairStore } from '../../store/repairStore';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { Bookmark, Send, MessageCircle } from 'lucide-react';
import RepairCard from '../../components/repair/RepairCard';
import QuoteModal from '../../components/repair/QuoteModal';
import EmptyState from '../../components/common/EmptyState';

const MySavedRepairs = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { getStoresByVendor } = useStoreStore();
    const { getSavedRepairsByVendor, addQuote, saveRepairByVendor } = useRepairStore();

    const [savedRepairs, setSavedRepairs] = useState([]);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [vendorStores, setVendorStores] = useState([]);

    useEffect(() => {
        if (user) {
            // Get vendor's stores
            const stores = getStoresByVendor(user.id);
            setVendorStores(stores);

            // Get saved repairs
            const saved = getSavedRepairsByVendor(user.id);
            // Sort by date descending
            saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSavedRepairs(saved);
        }
    }, [user]);

    const handleSendQuote = (repair) => {
        if (vendorStores.length === 0) {
            alert('Please create a store first before sending quotes');
            return;
        }
        setSelectedRepair(repair);
        setShowQuoteModal(true);
    };

    const handleQuoteSubmit = (quoteData) => {
        if (!selectedRepair || vendorStores.length === 0) return;

        const firstStore = vendorStores[0]; // Use first store for simplicity

        const quote = {
            vendorId: user.id,
            vendorName: user.name,
            storeName: firstStore.name,
            ...quoteData
        };

        addQuote(selectedRepair.id, quote);

        // Refresh saved repairs
        const saved = getSavedRepairsByVendor(user.id);
        saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSavedRepairs(saved);

        // Show success message
        alert('Quote sent successfully!');
    };

    const handleUnsave = (repairId) => {
        saveRepairByVendor(repairId, user.id); // Toggle save (will remove)

        // Refresh saved repairs
        const saved = getSavedRepairsByVendor(user.id);
        saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSavedRepairs(saved);
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                            <Bookmark className="w-6 h-6 text-white fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900">
                                Saved Repair Requests
                            </h1>
                            <p className="text-gray-500 font-sans tracking-wide uppercase text-sm mt-1">
                                Repairs you've bookmarked for later
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saved Repairs Grid */}
                {savedRepairs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedRepairs.map(repair => {
                            const isUnavailable = repair.status === 'in_progress' || repair.status === 'completed';
                            return (
                                <div
                                    key={repair.id}
                                    className={`relative ${isUnavailable ? 'opacity-50 blur-[1px] pointer-events-none' : ''}`}
                                >
                                    {isUnavailable && (
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                                            {repair.status === 'in_progress' ? 'In Progress' : 'Completed'}
                                        </div>
                                    )}
                                    <RepairCard
                                        repair={repair}
                                        actions={
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleSendQuote(repair)}
                                                    disabled={isUnavailable}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-gold rounded-lg font-sans font-bold text-sm border-2 border-gold shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Send Quote
                                                </button>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUnsave(repair.id)}
                                                        disabled={isUnavailable}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-sans font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Bookmark className="w-4 h-4 fill-current" />
                                                        Remove
                                                    </button>

                                                    <button
                                                        onClick={() => alert('Messaging feature coming soon')}
                                                        disabled={isUnavailable}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-sans font-semibold text-sm hover:border-gold hover:text-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        Message
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        type="repair"
                        title="No Saved Repairs"
                        message="You haven't saved any repair requests yet. Browse repair requests and save the ones you're interested in."
                        actionLabel="Browse Repair Requests"
                        onAction={() => navigate('/vendor/repair-requests')}
                    />
                )}
            </div>

            {/* Quote Modal */}
            <QuoteModal
                isOpen={showQuoteModal}
                onClose={() => {
                    setShowQuoteModal(false);
                    setSelectedRepair(null);
                }}
                onSubmit={handleQuoteSubmit}
                repairDetails={selectedRepair}
            />
        </div>
    );
};

export default MySavedRepairs;
