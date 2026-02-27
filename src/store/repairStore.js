import { create } from 'zustand';
import { getRepairs, setRepairs } from '../utils/localStorage';

export const useRepairStore = create((set, get) => ({
    repairs: [],

    // Initialize repairs from localStorage
    initRepairs: () => {
        const savedRepairs = getRepairs();
        set({ repairs: savedRepairs });
    },

    // Get all repairs
    getAllRepairs: () => {
        return get().repairs;
    },

    // Get repair by ID
    getRepairById: (id) => {
        return get().repairs.find(repair => repair.id === id);
    },

    // Get repairs by customer ID
    getRepairsByCustomer: (customerId) => {
        return get().repairs.filter(repair => repair.customerId === customerId);
    },

    // Get repairs by location (for vendor filtering)
    getRepairsByLocation: (location) => {
        return get().repairs.filter(repair =>
            repair.location.toLowerCase().includes(location.toLowerCase())
        );
    },

    // Get repairs by status
    getRepairsByStatus: (status) => {
        return get().repairs.filter(repair => repair.status === status);
    },

    // Get repairs by item type
    getRepairsByItemType: (itemType) => {
        return get().repairs.filter(repair => repair.itemType === itemType);
    },

    // Get repairs by issue type
    getRepairsByIssueType: (issueType) => {
        return get().repairs.filter(repair => repair.issueType === issueType);
    },

    // Create new repair request
    createRepair: (repairData) => {
        const newRepair = {
            ...repairData,
            id: `repair-${Date.now()}`,
            status: 'posted',
            quotes: [],
            interestedVendors: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedRepairs = [...get().repairs, newRepair];
        set({ repairs: updatedRepairs });
        setRepairs(updatedRepairs);
        return newRepair;
    },

    // Update repair status
    updateRepairStatus: (id, status, additionalData = {}) => {
        const updatedRepairs = get().repairs.map(repair =>
            repair.id === id ? {
                ...repair,
                status,
                ...additionalData,
                updatedAt: new Date().toISOString()
            } : repair
        );
        set({ repairs: updatedRepairs });
        setRepairs(updatedRepairs);
    },

    // Add quote to repair (vendor action)
    addQuote: (repairId, quoteData) => {
        const updatedRepairs = get().repairs.map(repair => {
            if (repair.id === repairId) {
                const newQuote = {
                    ...quoteData,
                    createdAt: new Date().toISOString()
                };

                // Change status to 'vendor_contacted' if this is the first quote
                const newStatus = repair.quotes.length === 0 ? 'vendor_contacted' : repair.status;

                return {
                    ...repair,
                    quotes: [...repair.quotes, newQuote],
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                };
            }
            return repair;
        });
        set({ repairs: updatedRepairs });
        setRepairs(updatedRepairs);
    },

    // Save repair by vendor (bookmark)
    saveRepairByVendor: (repairId, vendorId) => {
        const updatedRepairs = get().repairs.map(repair => {
            if (repair.id === repairId) {
                // Check if vendor already saved this
                if (repair.interestedVendors.includes(vendorId)) {
                    // Remove from saved (toggle)
                    return {
                        ...repair,
                        interestedVendors: repair.interestedVendors.filter(id => id !== vendorId),
                        updatedAt: new Date().toISOString()
                    };
                } else {
                    // Add to saved
                    return {
                        ...repair,
                        interestedVendors: [...repair.interestedVendors, vendorId],
                        updatedAt: new Date().toISOString()
                    };
                }
            }
            return repair;
        });
        set({ repairs: updatedRepairs });
        setRepairs(updatedRepairs);
    },

    // Get saved repairs by vendor
    getSavedRepairsByVendor: (vendorId) => {
        return get().repairs.filter(repair =>
            repair.interestedVendors.includes(vendorId)
        );
    },

    // Delete repair
    deleteRepair: (id) => {
        const updatedRepairs = get().repairs.filter(repair => repair.id !== id);
        set({ repairs: updatedRepairs });
        setRepairs(updatedRepairs);
    }
}));
