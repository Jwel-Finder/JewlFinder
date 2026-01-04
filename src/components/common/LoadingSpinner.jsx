import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
