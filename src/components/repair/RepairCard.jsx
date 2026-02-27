import { MapPin, Clock, MessageCircle } from 'lucide-react';

const RepairCard = ({ repair, actions, onClick }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'posted':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'vendor_contacted':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'in_progress':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getItemTypeIcon = (itemType) => {
        // Returns emoji for item type
        const icons = {
            ring: '💍',
            chain: '📿',
            earring: '💎',
            bracelet: '📿',
            other: '✨'
        };
        return icons[itemType] || icons.other;
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const truncateText = (text, maxLength = 60) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div
            className={`bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ${
                onClick ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                {repair.images && repair.images[0] ? (
                    <img
                        src={repair.images[0]}
                        alt={`${repair.itemType} repair`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-6xl opacity-50">{getItemTypeIcon(repair.itemType)}</span>
                    </div>
                )}

                {/* Item Type Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <p className="text-xs font-sans font-bold text-charcoal capitalize flex items-center gap-1">
                        <span>{getItemTypeIcon(repair.itemType)}</span>
                        {repair.itemType}
                    </p>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(
                            repair.status
                        )}`}
                    >
                        {repair.status.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* Quote Count (if any) */}
                {repair.quotes && repair.quotes.length > 0 && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-gold/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-white" />
                        <span className="text-xs font-sans font-bold text-white">
                            {repair.quotes.length} Quote{repair.quotes.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Issue Summary */}
                <div className="mb-3">
                    <h3 className="text-base font-serif font-semibold text-charcoal mb-1 capitalize">
                        {repair.issueType.replace(/_/g, ' ')}
                    </h3>
                    {repair.issueDescription && (
                        <p className="text-sm text-gray-600 font-sans">
                            {truncateText(repair.issueDescription)}
                        </p>
                    )}
                </div>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{repair.location}</span>
                    </div>

                    {/* Time Posted */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimeAgo(repair.createdAt)}</span>
                    </div>

                    {/* Weight (if provided) */}
                    {repair.approximateWeight && (
                        <div className="text-xs text-gray-500 font-sans">
                            Weight: ~{repair.approximateWeight}g
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {actions && <div className="pt-3 border-t border-gray-100">{actions}</div>}
            </div>
        </div>
    );
};

export default RepairCard;
