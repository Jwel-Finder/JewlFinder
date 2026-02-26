import { useEffect, useState } from 'react';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import { useInquiryStore } from '../../store/inquiryStore';
import { Users, Store, Package, MessageSquare, TrendingUp, AlertTriangle, Activity, CheckCircle, IndianRupee, Settings, ArrowRight } from 'lucide-react';
import { getUsers } from '../../utils/localStorage';
import { useAuthStore } from '../../store/authStore';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const { getAllStores, stores } = useStoreStore(); // Ensure getAllStores is available if needed, or just use stores if pre-fetched
    const { designs } = useDesignStore();
    const { inquiries } = useInquiryStore();

    // We can use local state for stats if we want to combine sources, 
    // but here we can derive directly from store hooks for simplicity or use the useEffect pattern
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0
    });

    useEffect(() => {
        const users = getUsers();
        const vendors = users.filter(u => u.role === 'vendor');
        setStats({
            totalUsers: users.length,
            totalVendors: vendors.length
        });
        // Ensure stores are loaded
        getAllStores();

        getAllStores();
    }, [getAllStores]);


    // Derived data
    const pendingStores = stores.filter(s => s.status === 'pending');
    const activeStores = stores.filter(s => s.status === 'approved');

    const statCards = [
        { label: 'Total Revenue', value: '₹45.2L', icon: IndianRupee, trend: '+18%', trendUp: true, color: 'text-gold' },
        { label: 'Active Boutiques', value: activeStores.length, icon: Store, trend: '+12', trendUp: true },
        { label: 'Pending Approvals', value: pendingStores.length, icon: AlertTriangle, trend: 'Action Req', trendUp: false, textColor: 'text-gold' },
        { label: 'Total Users', value: stats.totalUsers, icon: Users, trend: '+56', trendUp: true },
    ];

    return (
        <div className="min-h-screen bg-cream py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gold/20">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
                            Platform Overview
                        </h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-xs">
                            Admin Control Center
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <button className="p-3 bg-white border border-gray-200 hover:border-black rounded-full transition-colors shadow-sm">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-ivory p-6 border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300 rounded-lg group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-gold/5 rounded-full">
                                    <stat.icon className={`w-5 h-5 ${stat.color || 'text-gray-400'} group-hover:text-gold`} />
                                </div>
                                {stat.trend && (
                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-serif font-bold text-gray-900 mb-1 ${stat.textColor}`}>{stat.value}</h3>
                                <p className="text-xs text-gray-500 font-sans uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Health */}
                    <div className="lg:col-span-2 bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Platform Health</h2>
                            <button className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest flex items-center gap-1">
                                <Activity className="w-4 h-4" /> Live
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { label: 'Server Uptime', value: '99.9%', status: 'optimal' },
                                { label: 'Response Time', value: '45ms', status: 'optimal' },
                                { label: 'Error Rate', value: '0.01%', status: 'good' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-4 border border-gray-100 rounded-md">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                                    <p className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                                        {item.value}
                                        <span className={`w-2 h-2 rounded-full ${item.status === 'optimal' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="h-48 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm font-sans">
                            Activity Chart Visualization
                        </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Pending Actions</h2>
                        <div className="space-y-3">
                            {pendingStores.length > 0 ? (
                                pendingStores.slice(0, 3).map(store => (
                                    <div key={store.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-md">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{store.name}</h4>
                                            <p className="text-xs text-gray-500">{store.city}</p>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = '/admin/approve-stores'}
                                            className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-gold hover:text-black transition-colors"
                                        >
                                            Review
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-xs uppercase tracking-wide">
                                    No pending approvals
                                </div>
                            )}

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <button onClick={() => window.location.href = '/admin/monitor'} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-md transition-all group">
                                    <span className="text-sm font-bold text-gray-700">System Logs</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
