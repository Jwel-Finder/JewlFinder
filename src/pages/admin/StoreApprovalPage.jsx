import React, { useState, useEffect } from 'react';
import { useStoreStore } from '../../store/storeStore';
import { CheckCircle, XCircle, MapPin, Shield } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const StoreApprovalPage = () => {
    const { getAllStores, approveStore, rejectStore } = useStoreStore();
    const [pendingStores, setPendingStores] = useState([]);
    const [auditLog, setAuditLog] = useState([
        { id: 1, action: 'Approved Store', target: 'Royal Gems', date: '2023-10-25', status: 'Approved' },
        { id: 2, action: 'Rejected Store', target: 'Fake Jewelry Co', date: '2023-10-24', status: 'Rejected' },
    ]);

    // Fetch pending stores on mount
    useEffect(() => {
        const stores = getAllStores();
        const pending = stores.filter(store => store.status === 'pending');
        setPendingStores(pending);
    }, [getAllStores]);


    const handleApprove = (storeId) => {
        approveStore(storeId);
        // Refresh list
        const stores = getAllStores();
        setPendingStores(stores.filter(store => store.status === 'pending'));

        // Add to mock audit log
        const store = stores.find(s => s.id === storeId);
        setAuditLog(prev => [{
            id: Date.now(),
            action: 'Approved Store',
            target: store?.name || 'Unknown Store',
            date: new Date().toISOString().split('T')[0],
            status: 'Approved'
        }, ...prev]);
    };

    const handleReject = (storeId) => {
        if (window.confirm('Are you sure you want to reject this store registration?')) {
            rejectStore(storeId);
            // Refresh list
            const stores = getAllStores();
            setPendingStores(stores.filter(store => store.status === 'pending'));

            // Add to mock audit log
            const store = stores.find(s => s.id === storeId);
            setAuditLog(prev => [{
                id: Date.now(),
                action: 'Rejected Store',
                target: store?.name || 'Unknown Store',
                date: new Date().toISOString().split('T')[0],
                status: 'Rejected'
            }, ...prev]);
        }
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Boutique Approvals</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">Review and vet new boutique applications</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest shadow-md">
                        {pendingStores.length} Pending Requests
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Approvals List */}
                    <div className="lg:col-span-2 space-y-6">
                        {pendingStores.length > 0 ? (
                            pendingStores.map(store => (
                                <div key={store.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3 h-48 md:h-auto relative">
                                            <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                        </div>
                                        <div className="p-8 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-serif font-bold text-gray-900">{store.name}</h3>
                                                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-widest border border-yellow-200">
                                                        Pending Review
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mb-6">
                                                    <p className="text-gray-600 font-serif italic text-sm">"{store.description}"</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-sans uppercase tracking-wider pt-2 border-t border-gray-50">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-gold" />
                                                            {store.city}, {store.state}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span>{store.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleApprove(store.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white hover:bg-green-600 transition-colors py-3 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve Boutique
                                                </button>
                                                <button
                                                    onClick={() => handleReject(store.id)}
                                                    className="px-6 flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all py-3 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                type="store"
                                title="All Caught Up"
                                message="There are no pending boutique applications to review at this time."
                            />
                        )}
                    </div>

                    {/* Recent Decisions / Audit Log */}
                    <div className="bg-white p-8 border border-gray-100 shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-6 border-b border-gold/20 pb-4">
                            <Shield className="w-5 h-5 text-gold" />
                            <h2 className="text-xl font-serif font-bold text-gray-900">Decision Log</h2>
                        </div>

                        <div className="space-y-6">
                            {auditLog.map(log => (
                                <div key={log.id} className="relative pl-6 border-l border-gray-200">
                                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${log.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                    <p className="text-sm font-bold text-gray-900 mb-1">{log.target}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{log.action}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{log.date}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-colors border border-dashed border-gray-200">
                            View Full History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreApprovalPage;
