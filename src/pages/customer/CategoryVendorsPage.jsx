import { useParams, useNavigate } from 'react-router-dom';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import StoreCard from '../../components/common/StoreCard';
import EmptyState from '../../components/common/EmptyState';
import { ArrowLeft, Store } from 'lucide-react';

const CategoryVendorsPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { stores } = useStoreStore();
    const { designs } = useDesignStore();

    // Configuration for category styling
    const categoryConfig = {
        necklace: {
            title: "Exquisite Necklaces",
            subtitle: "Adorn yourself with timeless elegance",
            image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=2000"
        },
        rings: {
            title: "Statement Rings",
            subtitle: "A symbol of eternal beauty",
            image: "https://images.unsplash.com/photo-1605100804763-eb2fc6f1037a?auto=format&fit=crop&q=80&w=2000"
        },
        earrings: {
            title: "Dazzling Earrings",
            subtitle: "Sparkle with every turn",
            image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=2000"
        },
        bangles: {
            title: "Traditional Bangles",
            subtitle: "Heritage wrapped in gold",
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=2000"
        },
        bridal: {
            title: "The Bridal Collection",
            subtitle: "For your special moment",
            image: "https://images.unsplash.com/photo-1595928607842-4684ec443dd7?auto=format&fit=crop&q=80&w=2000"
        },
        default: {
            title: `${category} Collection`,
            subtitle: "Curated pieces just for you",
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000"
        }
    };

    const config = categoryConfig[category?.toLowerCase()] || categoryConfig.default;

    // 1. Get all designs for this category
    const categoryDesigns = designs.filter(
        d => d.category.toLowerCase() === category.toLowerCase() && d.availability === 'available'
    );

    // 2. Get unique store IDs from these designs
    const storeIds = [...new Set(categoryDesigns.map(d => d.storeId))];

    // 3. Filter stores that are approved, open, and in the list of storeIds
    const filteredStores = stores.filter(
        store => store.status === 'approved' && store.isOpen && storeIds.includes(store.id)
    );

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={config.image}
                        alt={config.title}
                        className="w-full h-full object-cover transition-transform duration-1000 md:scale-105 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Navbar Placeholder/Back Navigation */}
                <div className="absolute top-0 left-0 right-0 p-6 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/20 hover:border-gold/50"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-sans uppercase tracking-widest">Back</span>
                    </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 text-center">
                    <div className="inline-block mb-4 p-2 border border-gold/50 rounded-full bg-black/30 backdrop-blur-md">
                        <Store className="w-6 h-6 text-gold" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                        {config.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gold-100 font-sans font-light tracking-wide max-w-2xl mx-auto">
                        {config.subtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Stats / Intro */}
                <div className="flex items-center justify-between border-b border-gold/20 pb-6 mb-12">
                    <p className="text-gray-500 font-serif italic text-lg">
                        Discover exclusive boutiques
                    </p>
                    <div className="px-4 py-1 bg-gold/10 rounded-full border border-gold/20 text-gold-dark text-xs font-bold uppercase tracking-widest">
                        {filteredStores.length} {filteredStores.length === 1 ? 'Boutique' : 'Boutiques'} Found
                    </div>
                </div>

                {/* Stores Grid */}
                {filteredStores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStores.map(store => (
                            <StoreCard key={store.id} store={store} compact={true} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20">
                        <EmptyState
                            type="search"
                            title={`No ${category} Boutiques`}
                            message={`We couldn't find any boutiques specializing in ${category} at the moment.`}
                            actionLabel="Browse All Collections"
                            onAction={() => navigate('/customer/stores')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryVendorsPage;
