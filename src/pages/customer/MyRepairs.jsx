import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairStore } from '../../store/repairStore';
import { useAuthStore } from '../../store/authStore';
import { Wrench, Plus } from 'lucide-react';
import RepairCard from '../../components/repair/RepairCard';
import EmptyState from '../../components/common/EmptyState';

const MyRepairs = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { getRepairsByCustomer, getRepairsByStatus: filterByStatus } = useRepairStore();

    const [repairs, setRepairs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (user) {
            const customerRepairs = getRepairsByCustomer(user.id);
            // Sort by date descending
            customerRepairs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRepairs(customerRepairs);
        }
    }, [user]);

    const filteredRepairs = filterStatus === 'all'
        ? repairs
        : repairs.filter(repair => repair.status === filterStatus);

    const handleCardClick = (repairId) => {
        navigate(`/customer/repair/${repairId}`);
    };

    const handlePostNew = () => {
        navigate('/customer/post-repair');
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
                                My Repairs
                            </h1>
                            <p className="text-gray-500 font-sans text-sm mt-1">
                                Track your gold repair requests
                            </p>
                        </div>
                    </div>

                    {/* Post New Button */}
                    <button
                        onClick={handlePostNew}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-gold rounded-lg font-sans font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-gold hover:bg-gray-900"
                    >
                        <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-gold" strokeWidth={3} />
                        </div>
                        Post New Repair
                    </button>
                </div>

                {/* Status Filters */}
                {repairs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'posted', label: 'Posted' },
                            { value: 'vendor_contacted', label: 'Vendor Contacted' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'completed', label: 'Completed' }
                        ].map(status => (
                            <button
                                key={status.value}
                                onClick={() => setFilterStatus(status.value)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                                    filterStatus === status.value
                                        ? 'bg-black text-white border-black shadow-md'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-gold'
                                }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Repairs Grid */}
                {repairs.length > 0 ? (
                    filteredRepairs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRepairs.map(repair => (
                                <RepairCard
                                    key={repair.id}
                                    repair={repair}
                                    onClick={() => handleCardClick(repair.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center border border-dashed border-gray-300 rounded-lg">
                            <Wrench className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                No Repairs Found
                            </h3>
                            <p className="text-gray-500 text-sm">
                                No repairs match the selected filter.
                            </p>
                        </div>
                    )
                ) : (
                    <EmptyState
                        type="repair"
                        title="No Repair Requests Yet"
                        message="You haven't posted any repair requests yet. Get started by posting your first repair request."
                        actionLabel="Post Repair Request"
                        onAction={handlePostNew}
                    />
                )}
            </div>
        </div>
    );
};

export default MyRepairs;
