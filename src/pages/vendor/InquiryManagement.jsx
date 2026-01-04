import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { useInquiryStore } from '../../store/inquiryStore';
import { CheckCircle, MessageSquare, Plus, XCircle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const InquiryManagement = () => {
    const { user } = useAuthStore();
    const { getStoresByVendor } = useStoreStore();
    const { getInquiriesByStore, updateInquiryStatus } = useInquiryStore();
    const [vendorInquiries, setVendorInquiries] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (user) {
            const stores = getStoresByVendor(user.id);
            const allInquiries = stores.flatMap(store => {
                const inquiries = getInquiriesByStore(store.id);
                // Enhance inquiries with store name
                if (!inquiries) return [];
                return inquiries.map(inq => ({ ...inq, storeName: store.name }));
            });
            // Sort by date descending
            allInquiries.sort((a, b) => new Date(b.date) - new Date(a.date));
            setVendorInquiries(allInquiries);
        }
    }, [user, getInquiriesByStore, getStoresByVendor]);

    const handleStatusUpdate = (inquiryId, newStatus) => {
        updateInquiryStatus(inquiryId, newStatus);
        // Refresh local state
        const stores = getStoresByVendor(user.id);
        const allInquiries = stores.flatMap(store => {
            const inquiries = getInquiriesByStore(store.id);
            if (!inquiries) return [];
            return inquiries.map(inq => ({ ...inq, storeName: store.name }));
        });
        allInquiries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setVendorInquiries(allInquiries);
    };

    const filteredInquiries = filterStatus === 'all'
        ? vendorInquiries
        : vendorInquiries.filter(inq => inq.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'responded': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'closed': return 'bg-gray-50 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Client Inquiries</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">Manage communications with your esteemed clientele</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['all', 'pending', 'responded', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filterStatus === status
                                    ? 'bg-black text-white border-black shadow-md'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-gold'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Inquiries List */}
                {vendorInquiries.length > 0 ? (
                    <div className="space-y-6">
                        {filteredInquiries.length > 0 ? (
                            filteredInquiries.map(inquiry => (
                                <div key={inquiry.id} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-serif font-bold text-gray-900">{inquiry.customerName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-gold"></span>
                                                {inquiry.storeName}
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                {new Date(inquiry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex gap-2">
                                            {inquiry.status !== 'closed' && (
                                                <>
                                                    {inquiry.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(inquiry.id, 'responded')}
                                                            className="flex items-center gap-2 px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all"
                                                        >
                                                            <MessageSquare className="w-3 h-3" />
                                                            Mark Responded
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStatusUpdate(inquiry.id, 'closed')}
                                                        className="flex items-center gap-2 px-6 py-2 border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest hover:border-black hover:text-black hover:bg-gray-50 transition-all"
                                                    >
                                                        <CheckCircle className="w-3 h-3" />
                                                        Close Inquiry
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-none border-l-2 border-gold/30">
                                        <p className="text-gray-700 font-serif italic text-lg leading-relaxed">"{inquiry.message}"</p>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 font-sans">
                                            <span className="font-bold">Contact:</span> {inquiry.email} {inquiry.phone && `• ${inquiry.phone}`}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-12 text-center border border-dashed border-gray-300">
                                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Inquiries Found</h3>
                                <p className="text-gray-500 text-sm">No inquiries match the selected filter.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        type="inquiry"
                        title="No Inquiries Yet"
                        message="Client inquiries regarding your products will appear here."
                        actionLabel="Return to Dashboard"
                        onAction={() => window.location.href = '/vendor/dashboard'}
                    />
                )}
            </div>
        </div>
    );
};

export default InquiryManagement;
