import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDesignStore } from '../../store/designStore';
import { useStoreStore } from '../../store/storeStore';
import DesignCard from '../../components/common/DesignCard';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, SlidersHorizontal, ChevronRight, X } from 'lucide-react';

const CollectionsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { designs } = useDesignStore();
    const { stores } = useStoreStore();

    // URL Params state
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    // Local State
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
    const [searchQuery, setSearchQuery] = useState(searchParam || '');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Filters State
    const [priceRange, setPriceRange] = useState('all'); // all, under-50k, 50k-1l, 1l-plus
    const [sortBy, setSortBy] = useState('newest'); // newest, price-low-high, price-high-low

    // Sync state with URL
    useEffect(() => {
        if (categoryParam) setSelectedCategory(categoryParam);
        if (searchParam) setSearchQuery(searchParam);
    }, [categoryParam, searchParam]);

    // Update URL when state changes
    useEffect(() => {
        const params = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        setSearchParams(params);
    }, [selectedCategory, searchQuery, setSearchParams]);

    // Derive Categories
    const categories = useMemo(() => {
        const uniquecats = [...new Set(designs.map(d => d.category))];
        return ['all', ...uniquecats];
    }, [designs]);

    // Filter Logic
    const filteredDesigns = useMemo(() => {
        let result = designs.filter(d => d.availability === 'available');

        // 1. Category Filter
        if (selectedCategory !== 'all') {
            result = result.filter(d => d.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // 2. Search Filter (Name, Category, or Store Name)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(d => {
                const store = stores.find(s => s.id === d.storeId);
                const storeName = store ? store.name.toLowerCase() : '';
                return (
                    d.name.toLowerCase().includes(query) ||
                    d.category.toLowerCase().includes(query) ||
                    storeName.includes(query)
                );
            });
        }

        // 3. Price Filter
        if (priceRange !== 'all') {
            if (priceRange === 'under-50k') result = result.filter(d => d.price < 50000);
            else if (priceRange === '50k-1l') result = result.filter(d => d.price >= 50000 && d.price <= 100000);
            else if (priceRange === '1l-plus') result = result.filter(d => d.price > 100000);
        }

        // 4. Sorting
        if (sortBy === 'price-low-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high-low') {
            result.sort((a, b) => b.price - a.price);
        } else {
            // Newest (assuming default order is somewhat chronological or random)
            result.reverse();
        }

        return result;
    }, [designs, selectedCategory, searchQuery, priceRange, sortBy, stores]);

    const formatCategoryName = (cat) => {
        if (cat === 'all') return 'All Collections';
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col md:flex-row">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden bg-white p-4 flex justify-between items-center sticky top-[64px] z-20 shadow-sm">
                <span className="font-serif font-bold text-lg">
                    {selectedCategory === 'all' ? 'All Collections' : formatCategoryName(selectedCategory)}
                </span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 border border-gold/30 rounded-full hover:bg-gold/10"
                >
                    <SlidersHorizontal className="w-5 h-5 text-gold-dark" />
                </button>
            </div>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-md border-r border-gold/20 transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:h-[calc(100vh-64px)] md:sticky md:top-[64px]
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full overflow-y-auto p-6">
                    <div className="flex justify-between items-center md:hidden mb-6">
                        <h2 className="font-serif text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-sans font-bold text-gold-dark uppercase tracking-widest mb-4">
                            Categories
                        </h3>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsMobileMenuOpen(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group
                                        ${selectedCategory === category
                                            ? 'bg-gold text-white shadow-md transform scale-105'
                                            : 'text-gray-600 hover:bg-gold/10 hover:text-gold-dark'
                                        }
                                    `}
                                >
                                    <span>{formatCategoryName(category)}</span>
                                    {selectedCategory === category && (
                                        <ChevronRight className="w-4 h-4 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Filters in Sidebar */}
                    <div className="mb-8">
                        <h3 className="text-xs font-sans font-bold text-gold-dark uppercase tracking-widest mb-4">
                            Price Range
                        </h3>
                        <div className="space-y-2">
                            {[
                                { id: 'all', label: 'All Prices' },
                                { id: 'under-50k', label: 'Under ₹50,000' },
                                { id: '50k-1l', label: '₹50,000 - ₹1,00,000' },
                                { id: '1l-plus', label: 'Above ₹1,00,000' }
                            ].map((range) => (
                                <label key={range.id} className="flex items-center space-x-3 cursor-pointer group">
                                    <div className={`
                                        w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                        ${priceRange === range.id ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold'}
                                    `}>
                                        {priceRange === range.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="price"
                                        className="hidden"
                                        checked={priceRange === range.id}
                                        onChange={() => setPriceRange(range.id)}
                                    />
                                    <span className={`text-sm ${priceRange === range.id ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                        {range.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                            {formatCategoryName(selectedCategory)}
                        </h1>
                        <p className="text-gray-500 mt-1 font-sans text-sm">
                            Showing {filteredDesigns.length} exquisite pieces
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all cursor-pointer shadow-sm text-sm"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDesigns.map(design => (
                            <DesignCard key={design.id} design={design} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20">
                        <EmptyState
                            type="search"
                            title="No designs found"
                            message="Try adjusting your search or filters to find what you're looking for."
                            actionLabel="Clear Filters"
                            onAction={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                                setPriceRange('all');
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollectionsPage;
