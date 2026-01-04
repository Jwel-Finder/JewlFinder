import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiryStore } from '../../store/inquiryStore';
import { useAuthStore } from '../../store/authStore';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare, Eye } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const VisitStatusPage = () => {
    const navigate = useNavigate();
    const { getInquiriesByCustomer } = useInquiryStore();
    const { user } = useAuthStore();
    const [inquiries, setInquiries] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'accepted', 'scheduled', 'completed', 'rejected'

    useEffect(() => {
        if (user) {
            const customerInquiries = getInquiriesByCustomer(user.id);
            setInquiries(customerInquiries);
        }
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'accepted':
            case 'scheduled':
                return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <MessageSquare className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            accepted: 'bg-blue-100 text-blue-700',
            scheduled: 'bg-purple-100 text-purple-700',
            completed: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700'
        };

        const labels = {
            pending: 'Inquiry Sent',
            accepted: 'Visit Accepted',
            scheduled: 'Visit Scheduled',
            completed: 'Visit Completed',
            rejected: 'Rejected'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const filteredInquiries = filter === 'all'
        ? inquiries
        : inquiries.filter(inquiry => inquiry.status === filter);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Inquiries</h1>
                    <p className="text-gray-600">Track the status of your jewelry inquiries and store visits</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {['all', 'pending', 'accepted', 'scheduled', 'completed', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${filter === status
                                    ? 'gradient-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {status === 'all' ? 'All Inquiries' : status}
                        </button>
                    ))}
                </div>

                {/* Inquiries List */}
                {filteredInquiries.length > 0 ? (
                    <div className="space-y-4">
                        {filteredInquiries.map(inquiry => (
                            <div key={inquiry.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Inquiry Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            {getStatusIcon(inquiry.status)}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {inquiry.designName}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {inquiry.storeName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Sent: {formatDate(inquiry.createdAt)}</span>
                                            </div>
                                            {inquiry.visitDate && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-primary-600" />
                                                    <span className="font-medium">Visit: {formatDate(inquiry.visitDate)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 capitalize">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{inquiry.inquiryType}</span>
                                            </div>
                                        </div>

                                        {inquiry.message && (
                                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                "{inquiry.message}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        {getStatusBadge(inquiry.status)}

                                        <button
                                            onClick={() => navigate(`/customer/design/${inquiry.designId}`)}
                                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Design
                                        </button>
                                    </div>
                                </div>

                                {/* Timeline Progress (Optional Enhancement) */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between relative">
                                        {['pending', 'accepted', 'scheduled', 'completed'].map((step, index) => (
                                            <div key={step} className="flex flex-col items-center z-10 bg-white px-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${['pending', 'accepted', 'scheduled', 'completed'].indexOf(inquiry.status) >= index
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-xs text-gray-600 capitalize">{step}</span>
                                            </div>
                                        ))}
                                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                                            <div
                                                className="h-full bg-primary-500 transition-all duration-300"
                                                style={{
                                                    width: `${(['pending', 'accepted', 'scheduled', 'completed'].indexOf(inquiry.status) / 3) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        type="search"
                        title="No Inquiries Found"
                        message={
                            filter === 'all'
                                ? "You haven't sent any inquiries yet. Browse designs and send an inquiry to get started!"
                                : `No inquiries with status "${filter}" found.`
                        }
                        actionLabel="Browse Designs"
                        onAction={() => navigate('/customer/home')}
                    />
                )}
            </div>
        </div>
    );
};

export default VisitStatusPage;
