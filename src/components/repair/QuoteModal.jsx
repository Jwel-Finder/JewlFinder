import { useState, useEffect } from 'react';
import { X, IndianRupee } from 'lucide-react';

const QuoteModal = ({ isOpen, onClose, onSubmit, repairDetails }) => {
    const [formData, setFormData] = useState({
        estimatedPrice: '',
        timeRequired: '',
        pickupDropoff: 'both',
        notes: ''
    });

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                estimatedPrice: '',
                timeRequired: '',
                pickupDropoff: 'both',
                notes: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.estimatedPrice || !formData.timeRequired) {
            alert('Please fill in all required fields');
            return;
        }

        const price = parseFloat(formData.estimatedPrice);
        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price');
            return;
        }

        // Call onSubmit with form data
        onSubmit({
            ...formData,
            estimatedPrice: price
        });

        // Close modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-charcoal to-gray-800 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                        <h2 className="text-xl font-serif font-bold">Send Quote</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Repair Info Summary */}
                    {repairDetails && (
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                Repair Request
                            </p>
                            <div className="flex items-center gap-3">
                                {repairDetails.images && repairDetails.images[0] && (
                                    <img
                                        src={repairDetails.images[0]}
                                        alt="Item"
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-serif font-semibold text-charcoal capitalize">
                                        {repairDetails.itemType} - {repairDetails.issueType.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 font-sans">
                                        {repairDetails.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Estimated Price */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Estimated Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IndianRupee className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="estimatedPrice"
                                    value={formData.estimatedPrice}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    min="0"
                                    step="100"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 font-sans mt-1">
                                Enter your estimated repair cost
                            </p>
                        </div>

                        {/* Time Required */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Time Required <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="timeRequired"
                                value={formData.timeRequired}
                                onChange={handleChange}
                                placeholder="e.g., 2-3 days"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                required
                            />
                            <p className="text-xs text-gray-400 font-sans mt-1">
                                Estimated time to complete the repair
                            </p>
                        </div>

                        {/* Pickup/Dropoff */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-3">
                                Service Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'pickup', label: 'Pickup' },
                                    { value: 'dropoff', label: 'Drop-off' },
                                    { value: 'both', label: 'Both' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, pickupDropoff: option.value })
                                        }
                                        className={`px-4 py-3 rounded-lg text-sm font-sans font-semibold transition-all ${
                                            formData.pickupDropoff === option.value
                                                ? 'bg-gold text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any additional details about the repair service..."
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none font-sans"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-sans font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-black text-gold rounded-lg font-sans font-bold border-2 border-gold shadow-lg hover:shadow-xl hover:bg-gray-900 hover:scale-105 transition-all"
                            >
                                Send Quote
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default QuoteModal;
