import { create } from 'zustand';
import { getStores, setStores } from '../utils/localStorage';

export const useStoreStore = create((set, get) => ({
    stores: [],

    // Initialize stores from localStorage
    initStores: () => {
        const savedStores = getStores();
        if (!savedStores || savedStores.length === 0) {
            const demoStores = [
                {
                    id: 'store-demo-1',
                    vendorId: 'vendor-1',
                    name: 'Royal Gems & Co',
                    description: 'Heritage jewelry since 1950. Specializing in Kundan and Polki.',
                    city: 'Mumbai',
                    pincode: '400001',
                    address: '123, Colaba Causeway, Mumbai',
                    status: 'approved',
                    isOpen: true,
                    rating: 4.8,
                    image: 'https://images.unsplash.com/photo-1588444837495-26ead7b6b792?auto=format&fit=crop&q=80&w=1000'
                },
                {
                    id: 'store-demo-2',
                    vendorId: 'vendor-2',
                    name: 'Luxe Diamonds',
                    description: 'Contemporary diamond jewelry for the modern woman.',
                    city: 'Bangalore',
                    pincode: '560001',
                    address: '45, Brigade Road, Bangalore',
                    status: 'approved',
                    isOpen: true,
                    rating: 4.9,
                    image: 'https://images.unsplash.com/photo-1601121141461-9d62472b0fef?auto=format&fit=crop&q=80&w=1000'
                },
                {
                    id: 'store-demo-3',
                    vendorId: 'vendor-3',
                    name: 'Pink City Palace',
                    description: 'Authentic Rajasthani jewelry straight from Jaipur.',
                    city: 'Jaipur',
                    pincode: '302001',
                    address: '89, Johari Bazaar, Jaipur',
                    status: 'approved',
                    isOpen: true,
                    rating: 4.7,
                    image: 'https://images.unsplash.com/photo-1617038224538-276365d96c89?auto=format&fit=crop&q=80&w=1000'
                },
                {
                    id: 'store-demo-4',
                    vendorId: 'vendor-4',
                    name: 'Heritage Jewellers',
                    description: 'Tradition meets elegance. Gold and silver masterpieces.',
                    city: 'Delhi',
                    pincode: '110001',
                    address: '12, Cannaught Place, Delhi',
                    status: 'approved',
                    isOpen: true,
                    rating: 4.6,
                    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=1000'
                },
                {
                    id: 'store-demo-5',
                    vendorId: 'vendor-5',
                    name: 'Gold Souk',
                    description: 'The finest 22K gold jewelry collection in Chennai.',
                    city: 'Chennai',
                    pincode: '600001',
                    address: '78, T. Nagar, Chennai',
                    status: 'approved',
                    isOpen: true,
                    rating: 4.8,
                    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000'
                }
            ];
            set({ stores: demoStores });
            setStores(demoStores);
        } else {
            set({ stores: savedStores });
        }
    },

    // Get all stores
    getAllStores: () => {
        return get().stores;
    },

    // Get store by ID
    getStoreById: (id) => {
        return get().stores.find(store => store.id === id);
    },

    // Get stores by vendor ID
    getStoresByVendor: (vendorId) => {
        return get().stores.filter(store => store.vendorId === vendorId);
    },

    // Get stores by city
    getStoresByCity: (city) => {
        return get().stores.filter(store =>
            store.city.toLowerCase() === city.toLowerCase()
        );
    },

    // Get stores by pincode
    getStoresByPincode: (pincode) => {
        return get().stores.filter(store => store.pincode === pincode);
    },

    // Add new store
    addStore: (storeData) => {
        const newStore = {
            ...storeData,
            id: `store-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            isOpen: true,
            rating: 0,
            totalRatings: 0
        };

        const updatedStores = [...get().stores, newStore];
        set({ stores: updatedStores });
        setStores(updatedStores);
        return newStore;
    },

    // Update store
    updateStore: (id, updates) => {
        const updatedStores = get().stores.map(store =>
            store.id === id ? { ...store, ...updates } : store
        );
        set({ stores: updatedStores });
        setStores(updatedStores);
    },

    // Delete store
    deleteStore: (id) => {
        const updatedStores = get().stores.filter(store => store.id !== id);
        set({ stores: updatedStores });
        setStores(updatedStores);
    },

    // Toggle store open/closed status
    toggleStoreStatus: (id) => {
        const updatedStores = get().stores.map(store =>
            store.id === id ? { ...store, isOpen: !store.isOpen } : store
        );
        set({ stores: updatedStores });
        setStores(updatedStores);
    },

    // Update store approval status (admin only)
    updateStoreApproval: (id, status) => {
        const updatedStores = get().stores.map(store =>
            store.id === id ? { ...store, status } : store
        );
        set({ stores: updatedStores });
        setStores(updatedStores);
    }
}));
