import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRepairStore } from '../../store/repairStore';
import { MapPin, Weight, Calendar, Phone, MessageCircle, Mail, IndianRupee, Clock, Truck, ArrowLeft, Check } from 'lucide-react';
import StatusTracker from '../../components/repair/StatusTracker';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RepairDetails = () => {
    const { repairId } = useParams();
    const navigate = useNavigate();
    const { getRepairById, updateRepairStatus } = useRepairStore();
    const [repair, setRepair] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const repairData = getRepairById(repairId);
        if (repairData) {
            setRepair(repairData);
        }
    }, [repairId]);

    const handleAcceptQuote = (quote) => {
        if (window.confirm(`Accept quote from ${quote.storeName} for ₹${quote.estimatedPrice.toLocaleString()}?`)) {
            updateRepairStatus(repairId, 'in_progress', {
                acceptedQuote: {
                    vendorId: quote.vendorId,
                    vendorName: quote.vendorName,
                    storeName: quote.storeName,
                    estimatedPrice: quote.estimatedPrice,
                    acceptedAt: new Date().toISOString()
                }
            });
            // Refresh repair data
            const updatedRepair = getRepairById(repairId);
            setRepair(updatedRepair);
        }
    };

    const handleMarkAsComplete = () => {
        if (window.confirm('Mark this repair as completed? This action will finalize the repair process.')) {
            updateRepairStatus(repairId, 'completed', {
                completedAt: new Date().toISOString()
            });
            // Refresh repair data
            const updatedRepair = getRepairById(repairId);
            setRepair(updatedRepair);
        }
    };

    if (!repair) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <EmptyState
                    type="repair"
                    title="Repair Not Found"
                    message="The repair request you're looking for doesn't exist or has been removed."
                    actionLabel="Back to My Repairs"
                    onAction={() => navigate('/customer/gold-repair')}
                />
            </div>
        );
    }

    const getContactIcon = (method) => {
        switch (method) {
            case 'call':
                return Phone;
            case 'whatsapp':
                return MessageCircle;
            case 'chat':
                return Mail;
            default:
                return MessageCircle;
        }
    };

    const getPickupDropoffLabel = (type) => {
        switch (type) {
            case 'pickup':
                return 'Pickup Available';
            case 'dropoff':
                return 'Drop-off Only';
            case 'both':
                return 'Pickup & Drop-off';
            default:
                return type;
        }
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/customer/gold-repair')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gold transition-colors mb-6 font-sans"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Repairs
                </button>

                {/* Status Tracker */}
                <div className="mb-8">
                    <StatusTracker
                        currentStatus={repair.status}
                        timestamps={{
                            posted: repair.createdAt,
                            vendor_contacted: repair.quotes && repair.quotes.length > 0 ? repair.quotes[0].createdAt : null
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Repair Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-serif font-semibold text-charcoal mb-4">
                                Uploaded Photos
                            </h2>
                            {repair.images && repair.images.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={repair.images[selectedImage]}
                                            alt={`Repair ${selectedImage + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Thumbnails */}
                                    {repair.images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {repair.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                        selectedImage === index
                                                            ? 'border-gold shadow-md'
                                                            : 'border-gray-200 hover:border-gold/50'
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No images uploaded</p>
                            )}
                        </div>

                        {/* Repair Information */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-serif font-semibold text-charcoal mb-4">
                                Repair Information
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                            Item Type
                                        </p>
                                        <p className="text-base font-serif font-semibold text-charcoal capitalize">
                                            {repair.itemType}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                            Issue Type
                                        </p>
                                        <p className="text-base font-serif font-semibold text-charcoal capitalize">
                                            {repair.issueType.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>

                                {repair.issueDescription && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                            Issue Description
                                        </p>
                                        <p className="text-sm text-gray-700 font-sans">
                                            {repair.issueDescription}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gold mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                                Location
                                            </p>
                                            <p className="text-sm font-sans text-charcoal">
                                                {repair.location}
                                            </p>
                                        </div>
                                    </div>

                                    {repair.approximateWeight && (
                                        <div className="flex items-start gap-2">
                                            <Weight className="w-4 h-4 text-gold mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                                    Weight
                                                </p>
                                                <p className="text-sm font-sans text-charcoal">
                                                    ~{repair.approximateWeight}g
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-gold mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-1">
                                            Posted On
                                        </p>
                                        <p className="text-sm font-sans text-charcoal">
                                            {new Date(repair.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quotes Received */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-serif font-semibold text-charcoal mb-4">
                                Quotes Received ({repair.quotes?.length || 0})
                            </h2>

                            {repair.quotes && repair.quotes.length > 0 ? (
                                <div className="space-y-4">
                                    {repair.quotes.map((quote, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-200 rounded-lg hover:border-gold transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-serif font-semibold text-charcoal">
                                                        {quote.storeName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                                                        {quote.vendorName}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="flex items-center gap-1 text-xl font-serif font-bold text-gold">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {quote.estimatedPrice.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-sans">{quote.timeRequired}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Truck className="w-4 h-4" />
                                                    <span className="font-sans">{getPickupDropoffLabel(quote.pickupDropoff)}</span>
                                                </div>
                                            </div>

                                            {quote.notes && (
                                                <p className="text-sm text-gray-600 font-sans italic mb-3 p-3 bg-gray-50 rounded">
                                                    "{quote.notes}"
                                                </p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Accept Quote Button */}
                                                {repair.acceptedQuote?.vendorId === quote.vendorId ? (
                                                    <button
                                                        disabled
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-sans font-bold border-2 border-green-600 shadow-lg flex items-center justify-center gap-2 text-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Accepted
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAcceptQuote(quote)}
                                                        disabled={repair.status === 'in_progress' || repair.status === 'completed'}
                                                        className={`px-4 py-2 rounded-lg font-sans font-bold border-2 shadow-lg transition-all text-sm ${
                                                            repair.status === 'in_progress' || repair.status === 'completed'
                                                                ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                                                : 'bg-black text-gold border-gold hover:shadow-xl hover:bg-gray-900'
                                                        }`}
                                                    >
                                                        Accept Quote
                                                    </button>
                                                )}

                                                {/* Contact Vendor Button */}
                                                <button
                                                    onClick={() => {
                                                        // In a real app, this would open contact method based on preferredContact
                                                        alert(`Contact ${quote.storeName} via ${repair.preferredContact}`);
                                                    }}
                                                    className="px-4 py-2 bg-black text-gold rounded-lg font-sans font-bold border-2 border-gold shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all text-sm"
                                                >
                                                    Contact Vendor
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-sans text-sm">
                                        No quotes received yet. Vendors will respond within 24-48 hours.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm sticky top-4">
                            <h3 className="text-lg font-serif font-semibold text-charcoal mb-4 pb-3 border-b border-gray-100">
                                Request Summary
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-2">
                                        Status
                                    </p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border ${
                                        repair.status === 'posted'
                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            : repair.status === 'vendor_contacted'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : repair.status === 'in_progress'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-green-50 text-green-700 border-green-200'
                                    }`}>
                                        {repair.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-2">
                                        Preferred Contact
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const Icon = getContactIcon(repair.preferredContact);
                                            return <Icon className="w-4 h-4 text-gold" />;
                                        })()}
                                        <span className="text-sm font-sans text-charcoal capitalize">
                                            {repair.preferredContact}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-2">
                                        Request ID
                                    </p>
                                    <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                        {repair.id}
                                    </p>
                                </div>

                                {repair.quotes && repair.quotes.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 font-sans uppercase tracking-wide mb-2">
                                            Price Range
                                        </p>
                                        <p className="text-lg font-serif font-bold text-gold flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4" />
                                            {Math.min(...repair.quotes.map(q => q.estimatedPrice)).toLocaleString()}
                                            {' - '}
                                            <IndianRupee className="w-4 h-4" />
                                            {Math.max(...repair.quotes.map(q => q.estimatedPrice)).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {/* Mark as Complete Button */}
                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleMarkAsComplete}
                                        disabled={repair.status !== 'in_progress'}
                                        className={`w-full px-4 py-3 rounded-lg font-sans font-bold text-sm border-2 shadow-lg transition-all ${
                                            repair.status === 'in_progress'
                                                ? 'bg-black text-gold border-gold hover:shadow-xl hover:bg-gray-900 hover:scale-105'
                                                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        {repair.status === 'completed' ? 'Repair Completed ✓' : 'Mark as Complete'}
                                    </button>
                                    {repair.status !== 'in_progress' && repair.status !== 'completed' && (
                                        <p className="text-xs text-gray-400 text-center mt-2 font-sans">
                                            Accept a quote to enable
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairDetails;
