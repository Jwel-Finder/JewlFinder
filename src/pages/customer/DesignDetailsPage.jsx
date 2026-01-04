import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesignStore } from '../../store/designStore';
import { useStoreStore } from '../../store/storeStore';
import { ChevronLeft, ChevronRight, IndianRupee, Package, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DesignCard from '../../components/common/DesignCard';

const DesignDetailsPage = () => {
    const { designId } = useParams();
    const navigate = useNavigate();
    const { getDesignById, designs } = useDesignStore();
    const { getStoreById } = useStoreStore();
    const [design, setDesign] = useState(null);
    const [store, setStore] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const designData = getDesignById(designId);
        setDesign(designData);

        if (designData) {
            const storeData = getStoreById(designData.storeId);
            setStore(storeData);
        }

        setLoading(false);
    }, [designId]);

    const handleInquiry = () => {
        navigate(`/customer/inquiry/${designId}`);
    };

    if (loading) {
        return <LoadingSpinner message="Loading masterpiece details..." />;
    }

    if (!design) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <EmptyState
                    type="design"
                    title="Masterpiece Not Found"
                    message="The design you're looking for is no longer available."
                />
            </div>
        );
    }

    const isAvailable = design.availability === 'available';

    // Filter similar products (same category first, then others)
    let similarDesigns = designs
        .filter(d => d.category === design.category && d.id !== design.id);

    // If not enough similar items, fill with other available items
    if (similarDesigns.length < 4) {
        const otherDesigns = designs
            .filter(d => d.category !== design.category && d.id !== design.id && !similarDesigns.includes(d))
            .slice(0, 4 - similarDesigns.length);
        similarDesigns = [...similarDesigns, ...otherDesigns];
    }

    // Limit to 4 items
    similarDesigns = similarDesigns.slice(0, 4);

    return (
        <div className="min-h-screen bg-cream">
            {/* Breadcrumb / Back Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-sans uppercase tracking-widest text-xs font-bold">Back to Collection</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column: Imagery */}
                    <div className="space-y-4 lg:col-span-5">
                        {/* Main Image with constrained height */}
                        <div className="relative h-[400px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-sm mx-auto">
                            <img
                                src={design.images[currentImageIndex]}
                                alt={design.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${isAvailable ? 'bg-white/90 text-black' : 'bg-red-500 text-white'
                                    }`}>
                                    {isAvailable ? 'In Stock' : 'Sold Out'}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {design.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                                {design.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex
                                            ? 'border-gold opacity-100 scale-105'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details (Sticky) */}
                    <div className="lg:sticky lg:top-24 h-fit lg:col-span-7 max-w-2xl">
                        <div className="mb-4">
                            <p className="text-gold-dark font-sans text-[10px] font-bold uppercase tracking-widest mb-1">
                                {design.category} Collection
                            </p>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                                {design.name}
                            </h1>
                            {design.price && (
                                <div className="flex items-baseline gap-2 text-xl font-serif text-gray-900 mb-4 border-b border-gold/10 pb-3">
                                    <IndianRupee className="w-4 h-4 text-gray-400" />
                                    <span>{design.price.toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            <div className="text-xs text-gray-600 mb-6 font-sans font-light leading-relaxed">
                                {design.description}
                            </div>

                            {/* Specifications Grid */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
                                <h3 className="font-serif font-bold text-sm mb-3 text-gray-900">Product Details</h3>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Material</p>
                                        <p className="font-medium text-xs text-gray-900">{design.material}</p>
                                    </div>
                                    {design.weight && (
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Weight</p>
                                            <p className="font-medium text-xs text-gray-900">{design.weight}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Authenticity</p>
                                        <p className="font-medium text-xs text-gray-900">Certified</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Store</p>
                                        <button
                                            onClick={() => navigate(`/customer/store/${store?.id}`)}
                                            className="font-medium text-xs text-gold-dark hover:underline"
                                        >
                                            {store?.name}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {isAvailable ? (
                                    <button
                                        onClick={handleInquiry}
                                        className="w-full bg-black text-white font-serif tracking-widest uppercase py-3 text-[10px] hover:bg-gold hover:text-black transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-3 h-3" />
                                        Request Inquiry
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-100 text-gray-400 font-serif tracking-widest uppercase py-3 text-[10px] cursor-not-allowed border border-gray-200"
                                    >
                                        Currently Unavailable
                                    </button>
                                )}
                                <p className="text-center text-[10px] text-gray-400 mt-1">
                                    Inquiries are sent directly to the boutique via WhatsApp or Call.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarDesigns.length > 0 && (
                    <div className="border-t border-gold/10 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-bold text-gray-900">You May Also Like</h2>
                            <button
                                onClick={() => navigate('/customer/designs')}
                                className="text-xs font-bold text-gold-dark hover:text-black uppercase tracking-widest transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarDesigns.map(similarDesign => (
                                <DesignCard key={similarDesign.id} design={similarDesign} compact={true} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesignDetailsPage;
