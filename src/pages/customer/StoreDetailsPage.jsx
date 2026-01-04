import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import { MapPin, Phone, Clock, Star, Mail } from 'lucide-react';
import DesignCard from '../../components/common/DesignCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StoreDetailsPage = () => {
    const { storeId } = useParams();
    const { getStoreById } = useStoreStore();
    const { getDesignsByStore } = useDesignStore();
    const [store, setStore] = useState(null);
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const storeData = getStoreById(storeId);
        setStore(storeData);

        if (storeData) {
            const storeDesigns = getDesignsByStore(storeId);
            setDesigns(storeDesigns);
        }

        setLoading(false);
    }, [storeId]);

    if (loading) {
        return <LoadingSpinner message="Loading store details..." />;
    }

    if (!store) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <EmptyState
                    type="store"
                    title="Store Not Found"
                    message="The store you're looking for doesn't exist or has been removed."
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Store Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Store Image */}
                        <div className="lg:col-span-1">
                            <img
                                src={store.image}
                                alt={store.name}
                                className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                            />
                        </div>

                        {/* Store Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                        {store.name}
                                    </h1>
                                    <p className="text-gray-600">{store.description}</p>
                                </div>
                                {store.isOpen ? (
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        Open
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                        Closed
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1 bg-gold-100 px-3 py-2 rounded-lg">
                                    <Star className="w-5 h-5 text-gold-600 fill-current" />
                                    <span className="text-lg font-semibold text-gold-700">{store.rating}</span>
                                </div>
                                <span className="text-gray-600">({store.totalRatings} ratings)</span>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">Address</p>
                                        <p className="text-gray-600">{store.address}, {store.city}, {store.state} - {store.pincode}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">Phone</p>
                                        <a href={`tel:${store.phone}`} className="text-primary-600 hover:underline">
                                            {store.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">Hours</p>
                                        <p className="text-gray-600">{store.hours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Designs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Jewelry Designs ({designs.length})
                </h2>

                {designs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {designs.map(design => (
                            <DesignCard key={design.id} design={design} storeId={storeId} compact={true} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        type="design"
                        title="No Designs Available"
                        message="This store hasn't added any designs yet. Check back later!"
                    />
                )}
            </div>
        </div>
    );
};

export default StoreDetailsPage;
