// Filter and search utilities

export const searchStores = (stores, query) => {
    if (!query) return stores;

    const lowerQuery = query.toLowerCase();
    return stores.filter(store =>
        store.name.toLowerCase().includes(lowerQuery) ||
        store.city.toLowerCase().includes(lowerQuery) ||
        store.pincode.includes(lowerQuery) ||
        store.address.toLowerCase().includes(lowerQuery)
    );
};

export const filterStoresByCity = (stores, city) => {
    if (!city) return stores;
    return stores.filter(store =>
        store.city.toLowerCase().includes(city.toLowerCase())
    );
};

export const filterStoresByPincode = (stores, pincode) => {
    if (!pincode) return stores;
    return stores.filter(store => store.pincode.includes(pincode));
};

export const filterStoresByStatus = (stores, status) => {
    if (!status) return stores;
    return stores.filter(store => store.status === status);
};

export const filterDesignsByStore = (designs, storeId) => {
    if (!storeId) return designs;
    return designs.filter(design => design.storeId === storeId);
};

export const filterDesignsByCategory = (designs, category) => {
    if (!category) return designs;
    return designs.filter(design => design.category === category);
};

export const filterDesignsByAvailability = (designs, availability) => {
    if (!availability) return designs;
    return designs.filter(design => design.availability === availability);
};

export const searchDesigns = (designs, query) => {
    if (!query) return designs;

    const lowerQuery = query.toLowerCase();
    return designs.filter(design =>
        design.name.toLowerCase().includes(lowerQuery) ||
        design.description.toLowerCase().includes(lowerQuery) ||
        design.category.toLowerCase().includes(lowerQuery)
    );
};

export const sortStoresByRating = (stores, ascending = false) => {
    return [...stores].sort((a, b) =>
        ascending ? a.rating - b.rating : b.rating - a.rating
    );
};

export const sortDesignsByPrice = (designs, ascending = true) => {
    return [...designs].sort((a, b) =>
        ascending ? a.price - b.price : b.price - a.price
    );
};

export const getUniqueCities = (stores) => {
    return [...new Set(stores.map(store => store.city))];
};

export const getUniquePincodes = (stores) => {
    return [...new Set(stores.map(store => store.pincode))];
};

export const getDesignCategories = () => {
    return ['necklace', 'rings', 'earrings', 'bangles', 'bracelets', 'bridal'];
};
