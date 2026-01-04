import { Link } from 'react-router-dom';
import { IndianRupee, CheckCircle, XCircle } from 'lucide-react';

const DesignCard = ({ design, compact = false }) => {
    const isAvailable = design.availability === 'available';

    return (
        <Link
            to={`/customer/design/${design.id}`}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative ${compact ? 'max-w-[200px]' : ''}`}
        >
            {/* Design Image */}
            <div className={`relative ${compact ? 'h-32' : 'h-64'} overflow-hidden bg-gray-100`}>
                <img
                    src={design.images[0]}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Availability Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isAvailable
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {isAvailable ? (
                        <>
                            <CheckCircle className="w-3 h-3" />
                            Available
                        </>
                    ) : (
                        <>
                            <XCircle className="w-3 h-3" />
                            Sold Out
                        </>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
                    {design.category}
                </div>
            </div>

            {/* Design Info */}
            <div className={`flex flex-col flex-1 ${compact ? 'p-3' : 'p-4'}`}>
                <div className="mb-2">
                    <h3 className={`font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition line-clamp-1 ${compact ? 'text-sm' : 'text-lg'}`}>
                        {design.name}
                    </h3>
                    {/* The original description was here, but the edit removed it. */}
                    {/* <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {design.description}
                    </p> */}

                    {/* The original material & weight was here, but the edit removed it. */}
                    {/* <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{design.material}</span>
                        {design.weight && <span>{design.weight}</span>}
                    </div> */}

                    {design.price && (
                        <div className={`flex items-center gap-1 font-bold text-primary-600 ${compact ? 'text-sm' : 'text-lg'}`}>
                            <IndianRupee className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            {design.price.toLocaleString('en-IN')}
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for sold out */}
            {!isAvailable && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold bg-red-600 px-6 py-2 rounded-full transform rotate-12">
                        SOLD OUT
                    </span>
                </div>
            )}
        </Link>
    );
};

export default DesignCard;
