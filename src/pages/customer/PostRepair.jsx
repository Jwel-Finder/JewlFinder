import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairStore } from '../../store/repairStore';
import { useAuthStore } from '../../store/authStore';
import { Wrench, Phone, MessageCircle, Mail } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';
import SuccessModal from '../../components/common/SuccessModal';

const PostRepair = () => {
    const navigate = useNavigate();
    const { createRepair } = useRepairStore();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        itemType: '',
        issueType: '',
        issueDescription: '',
        images: [],
        approximateWeight: '',
        location: '',
        preferredContact: 'chat'
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const itemTypes = ['ring', 'chain', 'earring', 'bracelet', 'other'];
    const issueTypes = [
        { value: 'broken_earpiece', label: 'Broken Earpiece' },
        { value: 'missing_stone', label: 'Missing Stone' },
        { value: 'chain_cut', label: 'Chain Cut' },
        { value: 'bent_damaged', label: 'Bent/Damaged' },
        { value: 'custom', label: 'Other/Custom' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImagesChange = (newImages) => {
        setFormData({
            ...formData,
            images: newImages
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.itemType) {
            alert('Please select an item type');
            return;
        }

        if (!formData.issueType) {
            alert('Please select an issue type');
            return;
        }

        if (formData.issueType === 'custom' && !formData.issueDescription.trim()) {
            alert('Please describe the custom issue');
            return;
        }

        if (formData.images.length === 0) {
            alert('Please upload at least 1 photo');
            return;
        }

        if (!formData.location.trim()) {
            alert('Please enter your location');
            return;
        }

        // Create repair request
        const repairData = {
            customerId: user.id,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
            itemType: formData.itemType,
            issueType: formData.issueType,
            issueDescription: formData.issueType === 'custom' ? formData.issueDescription : '',
            images: formData.images,
            approximateWeight: formData.approximateWeight,
            location: formData.location,
            preferredContact: formData.preferredContact
        };

        createRepair(repairData);

        // Show success modal
        setShowSuccess(true);

        // Navigate to My Repairs after 2 seconds
        setTimeout(() => {
            navigate('/customer/gold-repair');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
                                Post a Repair Request
                            </h1>
                            <p className="text-gray-500 font-sans text-sm mt-1">
                                Get quotes from verified gold repair specialists
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
                    {/* Section 1: Gold Item Details */}
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 pb-2 border-b border-gold/20">
                            Gold Item Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Item Type */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Item Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="itemType"
                                    value={formData.itemType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans capitalize"
                                    required
                                >
                                    <option value="">Select item type</option>
                                    {itemTypes.map(type => (
                                        <option key={type} value={type} className="capitalize">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Issue Type */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Issue Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="issueType"
                                    value={formData.issueType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                    required
                                >
                                    <option value="">Select issue type</option>
                                    {issueTypes.map(issue => (
                                        <option key={issue.value} value={issue.value}>
                                            {issue.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Custom Issue Description (conditional) */}
                        {formData.issueType === 'custom' && (
                            <div className="mt-6">
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Describe the Issue <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="issueDescription"
                                    value={formData.issueDescription}
                                    onChange={handleChange}
                                    placeholder="Please describe the issue with your gold item..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none font-sans"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Section 2: Upload Photos */}
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 pb-2 border-b border-gold/20">
                            Upload Photos <span className="text-red-500">*</span>
                        </h2>
                        <ImageUpload images={formData.images} onChange={handleImagesChange} maxImages={5} />
                    </div>

                    {/* Section 3: Additional Information */}
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 pb-2 border-b border-gold/20">
                            Additional Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Approximate Weight */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Approximate Weight (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="approximateWeight"
                                        value={formData.approximateWeight}
                                        onChange={handleChange}
                                        placeholder="15"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans pr-16"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">
                                        grams
                                    </span>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-serif font-semibold text-charcoal mb-2">
                                    Location (City/Area) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Mumbai, Andheri"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Contact Preference */}
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-charcoal mb-4 pb-2 border-b border-gold/20">
                            Preferred Contact Method
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { value: 'chat', label: 'Chat', icon: MessageCircle, color: 'blue' },
                                { value: 'call', label: 'Call', icon: Phone, color: 'green' },
                                { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'emerald' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, preferredContact: option.value })}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        formData.preferredContact === option.value
                                            ? 'border-gold bg-gold/5 shadow-md'
                                            : 'border-gray-200 hover:border-gold/50'
                                    }`}
                                >
                                    <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                                        formData.preferredContact === option.value ? 'text-gold' : 'text-gray-400'
                                    }`} />
                                    <p className={`font-semibold text-sm ${
                                        formData.preferredContact === option.value ? 'text-gold' : 'text-gray-700'
                                    }`}>
                                        {option.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto md:min-w-[300px] mx-auto block px-8 py-4 bg-black text-gold rounded-lg font-sans font-bold text-lg border-2 border-gold shadow-xl hover:shadow-2xl hover:bg-gray-900 hover:scale-105 transition-all duration-300"
                        >
                            Post Repair Request
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-3 font-sans">
                            You'll receive quotes from verified vendors within 24-48 hours
                        </p>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message="Repair request posted successfully! Redirecting to your repairs..."
            />
        </div>
    );
};

export default PostRepair;
