import { create } from 'zustand';
import { getDesigns, setDesigns } from '../utils/localStorage';

export const useDesignStore = create((set, get) => ({
    designs: [],

    // Initialize designs from localStorage
    initDesigns: () => {
        const savedDesigns = getDesigns();
        if (!savedDesigns || savedDesigns.length === 0) {
            const demoDesigns = [
                // Mumbai Store
                { id: 'd1', storeId: 'store-demo-1', name: 'Royal Kundan Necklace', price: 150000, category: 'necklace', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd2', storeId: 'store-demo-1', name: 'Antique Gold Bangles', price: 85000, category: 'bangles', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd3', storeId: 'store-demo-1', name: 'Polki Earrings', price: 45000, category: 'earrings', image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=1000', availability: 'available' },

                // Bangalore Store
                { id: 'd4', storeId: 'store-demo-2', name: 'Solitaire Diamond Ring', price: 250000, category: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-eb2fc6f1037a?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd5', storeId: 'store-demo-2', name: 'Platinum Band', price: 60000, category: 'rings', image: 'https://images.unsplash.com/photo-1598560976315-1823d92f6e21?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd6', storeId: 'store-demo-2', name: 'Diamond Pendant', price: 95000, category: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000', availability: 'available' },

                // Jaipur Store
                { id: 'd7', storeId: 'store-demo-3', name: 'Meenakari Choker', price: 120000, category: 'necklace', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd8', storeId: 'store-demo-3', name: 'Traditional Jhumkas', price: 35000, category: 'earrings', image: 'https://images.unsplash.com/photo-1633810052675-10ac711ea609?auto=format&fit=crop&q=80&w=1000', availability: 'available' },

                // Delhi Store
                { id: 'd9', storeId: 'store-demo-4', name: 'Temple Jewellery Set', price: 180000, category: 'bridal', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000', availability: 'available' },
                { id: 'd10', storeId: 'store-demo-4', name: 'Gold Coin Necklace', price: 220000, category: 'necklace', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000', availability: 'available' }
            ];
            set({ designs: demoDesigns });
            setDesigns(demoDesigns);
        } else {
            set({ designs: savedDesigns });
        }
    },

    // Get all designs
    getAllDesigns: () => {
        return get().designs;
    },

    // Get design by ID
    getDesignById: (id) => {
        return get().designs.find(design => design.id === id);
    },

    // Get designs by store ID
    getDesignsByStore: (storeId) => {
        return get().designs.filter(design => design.storeId === storeId);
    },

    // Get designs by category
    getDesignsByCategory: (category) => {
        return get().designs.filter(design => design.category === category);
    },

    // Get available designs
    getAvailableDesigns: () => {
        return get().designs.filter(design => design.availability === 'available');
    },

    // Add new design
    addDesign: (designData) => {
        const newDesign = {
            ...designData,
            id: `design-${Date.now()}`,
            createdAt: new Date().toISOString(),
            availability: 'available'
        };

        const updatedDesigns = [...get().designs, newDesign];
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
        return newDesign;
    },

    // Update design
    updateDesign: (id, updates) => {
        const updatedDesigns = get().designs.map(design =>
            design.id === id ? { ...design, ...updates } : design
        );
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
    },

    // Delete design
    deleteDesign: (id) => {
        const updatedDesigns = get().designs.filter(design => design.id !== id);
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
    },

    // Toggle availability (available/sold_out)
    toggleAvailability: (id) => {
        const updatedDesigns = get().designs.map(design =>
            design.id === id ? {
                ...design,
                availability: design.availability === 'available' ? 'sold_out' : 'available'
            } : design
        );
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
    },

    // Mark as sold out
    markAsSoldOut: (id) => {
        const updatedDesigns = get().designs.map(design =>
            design.id === id ? { ...design, availability: 'sold_out' } : design
        );
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
    },

    // Reactivate design
    reactivateDesign: (id) => {
        const updatedDesigns = get().designs.map(design =>
            design.id === id ? { ...design, availability: 'available' } : design
        );
        set({ designs: updatedDesigns });
        setDesigns(updatedDesigns);
    }
}));
