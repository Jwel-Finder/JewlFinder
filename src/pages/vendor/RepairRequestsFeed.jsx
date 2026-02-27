import { useState, useEffect } from 'react';
import { useRepairStore } from '../../store/repairStore';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { Wrench, Send, Bookmark, MessageCircle, X } from 'lucide-react';
import RepairCard from '../../components/repair/RepairCard';
import QuoteModal from '../../components/repair/QuoteModal';
import EmptyState from '../../components/common/EmptyState';

const RepairRequestsFeed = () => {
    const { user } = useAuthStore();
    const { getStoresByVendor } = useStoreStore();
    const { getAllRepairs, addQuote, saveRepairByVendor, getSavedRepairsByVendor } = useRepairStore();

    const [repairs, setRepairs] = useState([]);
    const [filteredRepairs, setFilteredRepairs] = useState([]);
    const [filters, setFilters] = useState({
        location: 'all',
        itemType: 'all',
        issueType: 'all'
    });
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [savedRepairIds, setSavedRepairIds] = useState([]);
    const [vendorStores, setVendorStores] = useState([]);

    useEffect(() => {
        // Get vendor's stores
        if (user) {
            const stores = getStoresByVendor(user.id);
            setVendorStores(stores);
        }

        // Get all repairs
        const allRepairs = getAllRepairs();
        setRepairs(allRepairs);
        setFilteredRepairs(allRepairs);

        // Get saved repairs
        if (user) {
            const saved = getSavedRepairsByVendor(user.id);
            setSavedRepairIds(saved.map(r => r.id));
        }
    }, [user]);

    useEffect(() => {
        // Apply filters
        let filtered = [...repairs];

        if (filters.location !== 'all') {
            filtered = filtered.filter(r => r.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.itemType !== 'all') {
            filtered = filtered.filter(r => r.itemType === filters.itemType);
        }

        if (filters.issueType !== 'all') {
            filtered = filtered.filter(r => r.issueType === filters.issueType);
        }

        setFilteredRepairs(filtered);
    }, [filters, repairs]);

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

        // Refresh repairs
        const allRepairs = getAllRepairs();
        setRepairs(allRepairs);

        // Show success message
        alert('Quote sent successfully!');
    };

    const handleSaveRepair = (repairId) => {
        saveRepairByVendor(repairId, user.id);

        // Update saved repairs list
        const saved = getSavedRepairsByVendor(user.id);
        setSavedRepairIds(saved.map(r => r.id));
    };

    const handleClearFilters = () => {
        setFilters({
            location: 'all',
            itemType: 'all',
            issueType: 'all'
        });
    };

    // Get unique values for filters
    const locations = ['all', ...new Set(repairs.map(r => r.location))];
    const itemTypes = ['all', 'ring', 'chain', 'earring', 'bracelet', 'other'];
    const issueTypes = [
        'all',
        'broken_earpiece',
        'missing_stone',
        'chain_cut',
        'bent_damaged',
        'custom'
    ];

    const hasActiveFilters = filters.location !== 'all' || filters.itemType !== 'all' || filters.issueType !== 'all';

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                            Repair Requests
                        </h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">
                            Browse and respond to gold repair requests
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-semibold text-charcoal">
                            Filters
                        </h3>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors font-sans"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Filter */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Location
                            </label>
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc} className="capitalize">
                                        {loc === 'all' ? 'All Locations' : loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Item Type Filter */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Item Type
                            </label>
                            <select
                                value={filters.itemType}
                                onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans capitalize"
                            >
                                {itemTypes.map(type => (
                                    <option key={type} value={type} className="capitalize">
                                        {type === 'all' ? 'All Items' : type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Issue Type Filter */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Issue Type
                            </label>
                            <select
                                value={filters.issueType}
                                onChange={(e) => setFilters({ ...filters, issueType: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                            >
                                {issueTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Issues' : type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Repairs Grid */}
                {filteredRepairs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRepairs.map(repair => {
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
                                                        onClick={() => handleSaveRepair(repair.id)}
                                                        disabled={isUnavailable}
                                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-sans font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            savedRepairIds.includes(repair.id)
                                                                ? 'bg-gold text-white'
                                                                : 'border border-gray-300 text-gray-700 hover:border-gold hover:text-gold'
                                                        }`}
                                                    >
                                                        <Bookmark className={`w-4 h-4 ${savedRepairIds.includes(repair.id) ? 'fill-current' : ''}`} />
                                                        {savedRepairIds.includes(repair.id) ? 'Saved' : 'Save'}
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
                        title="No Repair Requests Found"
                        message={
                            hasActiveFilters
                                ? 'No repair requests match your selected filters. Try adjusting your filters.'
                                : 'No repair requests available at the moment. Check back later for new requests.'
                        }
                        actionLabel={hasActiveFilters ? 'Clear Filters' : null}
                        onAction={hasActiveFilters ? handleClearFilters : null}
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

export default RepairRequestsFeed;
