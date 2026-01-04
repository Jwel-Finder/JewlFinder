// Dummy users for authentication
export const DUMMY_USERS = [
    // Admin
    {
        id: 'admin-1',
        email: 'admin@jewel.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        createdAt: '2024-01-01'
    },
    // Vendors
    {
        id: 'vendor-1',
        email: 'vendor1@jewel.com',
        password: 'vendor123',
        role: 'vendor',
        name: 'Gold Palace Owner',
        storeIds: ['store-1'],
        status: 'approved',
        createdAt: '2024-01-15'
    },
    {
        id: 'vendor-2',
        email: 'vendor2@jewel.com',
        password: 'vendor123',
        role: 'vendor',
        name: 'Diamond Dreams Owner',
        storeIds: ['store-2'],
        status: 'approved',
        createdAt: '2024-02-01'
    },
    {
        id: 'vendor-3',
        email: 'vendor3@jewel.com',
        password: 'vendor123',
        role: 'vendor',
        name: 'Silver Elegance Owner',
        storeIds: ['store-3'],
        status: 'pending',
        createdAt: '2024-03-10'
    },
    // Customers
    {
        id: 'customer-1',
        email: 'customer@jewel.com',
        password: 'customer123',
        role: 'customer',
        name: 'John Doe',
        phone: '+91 9876543210',
        createdAt: '2024-02-15'
    },
    {
        id: 'customer-2',
        email: 'customer2@jewel.com',
        password: 'customer123',
        role: 'customer',
        name: 'Jane Smith',
        phone: '+91 9876543211',
        createdAt: '2024-03-01'
    }
];

// Dummy jewelry stores
export const DUMMY_STORES = [
    {
        id: 'store-1',
        vendorId: 'vendor-1',
        name: 'Gold Palace',
        description: 'Premium gold jewelry since 1990',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        address: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 22 1234 5678',
        rating: 4.5,
        totalRatings: 245,
        status: 'approved',
        isOpen: true,
        hours: 'Mon-Sat: 10:00 AM - 8:00 PM',
        createdAt: '2024-01-15'
    },
    {
        id: 'store-2',
        vendorId: 'vendor-2',
        name: 'Diamond Dreams',
        description: 'Exquisite diamond collections',
        image: 'https://images.unsplash.com/photo-1601121141418-1c7e4e6d3f6e?w=800',
        address: '456 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        phone: '+91 22 2345 6789',
        rating: 4.7,
        totalRatings: 189,
        status: 'approved',
        isOpen: true,
        hours: 'Mon-Sun: 11:00 AM - 9:00 PM',
        createdAt: '2024-02-01'
    },
    {
        id: 'store-3',
        vendorId: 'vendor-3',
        name: 'Silver Elegance',
        description: 'Beautiful silver ornaments',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        address: '789 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        phone: '+91 80 3456 7890',
        rating: 4.3,
        totalRatings: 156,
        status: 'pending',
        isOpen: true,
        hours: 'Mon-Sat: 10:30 AM - 7:30 PM',
        createdAt: '2024-03-10'
    }
];

// Dummy jewelry designs
export const DUMMY_DESIGNS = [
    // Gold Palace designs
    {
        id: 'design-1',
        storeId: 'store-1',
        name: 'Traditional Gold Necklace',
        description: 'Beautiful traditional 22K gold necklace with intricate designs',
        category: 'necklace',
        images: [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'
        ],
        price: 125000,
        weight: '45g',
        material: '22K Gold',
        availability: 'available',
        createdAt: '2024-01-20'
    },
    {
        id: 'design-2',
        storeId: 'store-1',
        name: 'Gold Bangle Set',
        description: 'Pair of elegant gold bangles',
        category: 'bangles',
        images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'
        ],
        price: 85000,
        weight: '30g',
        material: '22K Gold',
        availability: 'available',
        createdAt: '2024-01-22'
    },
    {
        id: 'design-3',
        storeId: 'store-1',
        name: 'Bridal Gold Set',
        description: 'Complete bridal jewelry set with necklace, earrings, and bangles',
        category: 'bridal',
        images: [
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'
        ],
        price: 350000,
        weight: '120g',
        material: '22K Gold',
        availability: 'sold_out',
        createdAt: '2024-02-01'
    },
    // Diamond Dreams designs
    {
        id: 'design-4',
        storeId: 'store-2',
        name: 'Diamond Solitaire Ring',
        description: 'Stunning 1 carat diamond solitaire ring in platinum',
        category: 'rings',
        images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'
        ],
        price: 250000,
        weight: '5g',
        material: 'Platinum with Diamond',
        availability: 'available',
        createdAt: '2024-02-05'
    },
    {
        id: 'design-5',
        storeId: 'store-2',
        name: 'Diamond Stud Earrings',
        description: 'Classic diamond stud earrings',
        category: 'earrings',
        images: [
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
        ],
        price: 75000,
        weight: '3g',
        material: '18K Gold with Diamonds',
        availability: 'available',
        createdAt: '2024-02-10'
    },
    {
        id: 'design-6',
        storeId: 'store-2',
        name: 'Diamond Tennis Bracelet',
        description: 'Elegant tennis bracelet with brilliant cut diamonds',
        category: 'bracelets',
        images: [
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'
        ],
        price: 180000,
        weight: '15g',
        material: '18K White Gold with Diamonds',
        availability: 'available',
        createdAt: '2024-02-15'
    },
    // Silver Elegance designs
    {
        id: 'design-7',
        storeId: 'store-3',
        name: 'Silver Oxidized Necklace',
        description: 'Traditional oxidized silver necklace',
        category: 'necklace',
        images: [
            'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'
        ],
        price: 8500,
        weight: '25g',
        material: 'Sterling Silver',
        availability: 'available',
        createdAt: '2024-03-12'
    },
    {
        id: 'design-8',
        storeId: 'store-3',
        name: 'Silver Toe Rings',
        description: 'Set of 4 beautiful silver toe rings',
        category: 'rings',
        images: [
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'
        ],
        price: 2500,
        weight: '8g',
        material: 'Sterling Silver',
        availability: 'available',
        createdAt: '2024-03-15'
    }
];

// Dummy inquiries
export const DUMMY_INQUIRIES = [
    {
        id: 'inquiry-1',
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerPhone: '+91 9876543210',
        customerEmail: 'customer@jewel.com',
        storeId: 'store-1',
        storeName: 'Gold Palace',
        designId: 'design-1',
        designName: 'Traditional Gold Necklace',
        message: 'I am interested in this necklace. Would like to visit the store.',
        inquiryType: 'message', // 'call', 'whatsapp', 'message'
        status: 'accepted', // 'pending', 'accepted', 'rejected', 'scheduled', 'completed'
        visitDate: '2024-04-15',
        createdAt: '2024-04-10T10:30:00',
        updatedAt: '2024-04-11T14:20:00'
    },
    {
        id: 'inquiry-2',
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerPhone: '+91 9876543210',
        customerEmail: 'customer@jewel.com',
        storeId: 'store-2',
        storeName: 'Diamond Dreams',
        designId: 'design-4',
        designName: 'Diamond Solitaire Ring',
        message: 'Looking for engagement ring',
        inquiryType: 'whatsapp',
        status: 'completed',
        visitDate: '2024-04-08',
        createdAt: '2024-04-05T16:45:00',
        updatedAt: '2024-04-08T18:00:00'
    },
    {
        id: 'inquiry-3',
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        customerPhone: '+91 9876543211',
        customerEmail: 'customer2@jewel.com',
        storeId: 'store-1',
        storeName: 'Gold Palace',
        designId: 'design-2',
        designName: 'Gold Bangle Set',
        message: 'Want to see this in person',
        inquiryType: 'message',
        status: 'pending',
        createdAt: '2024-04-12T09:15:00',
        updatedAt: '2024-04-12T09:15:00'
    }
];

// Initialize localStorage with dummy data if not exists
export const initializeDummyData = () => {
    if (!localStorage.getItem('jewel_users')) {
        localStorage.setItem('jewel_users', JSON.stringify(DUMMY_USERS));
    }
    if (!localStorage.getItem('jewel_stores')) {
        localStorage.setItem('jewel_stores', JSON.stringify(DUMMY_STORES));
    }
    if (!localStorage.getItem('jewel_designs')) {
        localStorage.setItem('jewel_designs', JSON.stringify(DUMMY_DESIGNS));
    }
    if (!localStorage.getItem('jewel_inquiries')) {
        localStorage.setItem('jewel_inquiries', JSON.stringify(DUMMY_INQUIRIES));
    }
};
