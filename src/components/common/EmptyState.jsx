import { PackageX, Search, Store, FileX } from 'lucide-react';

const EmptyState = ({
    type = 'default',
    title,
    message,
    actionLabel,
    onAction
}) => {
    const getIcon = () => {
        switch (type) {
            case 'search':
                return <Search className="w-16 h-16 text-gray-400" />;
            case 'store':
                return <Store className="w-16 h-16 text-gray-400" />;
            case 'design':
                return <PackageX className="w-16 h-16 text-gray-400" />;
            default:
                return <FileX className="w-16 h-16 text-gray-400" />;
        }
    };

    return (
        <div className="text-center py-16 px-4">
            <div className="flex justify-center mb-6">
                {getIcon()}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {title || 'No Data Found'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {message || 'There is nothing to display at the moment.'}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="gradient-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
