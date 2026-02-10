import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message, autoCloseDuration = 3000 }) => {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDuration]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-2xl font-serif font-bold text-gray-900 text-center mb-2">
          Success!
        </h3>
        <p className="text-gray-600 text-center text-base leading-relaxed">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
