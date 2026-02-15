import { Link } from 'react-router-dom';
import { MapPin, Star, Phone, Clock } from 'lucide-react';

const StoreCard = ({ store, compact = false }) => {
    // Generate random distance for demo (0.5 to 10 km)
    const randomDistance = (Math.random() * 9.5 + 0.5).toFixed(1);

    return (
        <Link
            to={`/customer/store/${store.id}`}
            className={`group bg-white border border-gray-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300 block overflow-hidden ${compact ? 'max-w-sm' : ''}`}
        >
            {/* Store Image */}
            <div className={`relative ${compact ? 'h-40' : 'h-64'} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {!store.isOpen && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-1 text-xs font-sans uppercase tracking-widest">
                        Closed
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/90 text-sm font-sans flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {store.city}
                    </p>
                </div>
            </div>

            {/* Store Info */}
            <div className={`${compact ? 'p-4' : 'p-6'} text-center`}>
                <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-serif font-bold text-gray-900 mb-1 group-hover:text-gold-dark transition duration-300`}>
                    {store.name}
                </h3>

                {/* Distance Indicator */}
                <div className="flex items-center justify-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-gray-400" strokeWidth={2} />
                    <span className="text-xs text-gray-400 font-sans">
                        {randomDistance} km away from your location
                    </span>
                </div>

                <p className="text-sm text-gray-500 font-sans tracking-wide mb-4 line-clamp-2">
                    {store.description}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-3 h-3 ${star <= Math.round(store.rating) ? 'text-gold fill-current' : 'text-gray-200'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">({store.totalRatings})</span>
                </div>

                <div className={`inline-block ${compact ? 'px-4 py-1 text-[10px]' : 'px-6 py-2 text-xs'} border border-gray-200 font-sans uppercase tracking-widest text-gray-600 group-hover:bg-black group-hover:text-white group-hover:border-black transition duration-300`}>
                    View Boutique
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;
