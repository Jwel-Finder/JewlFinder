import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import { useInquiryStore } from '../../store/inquiryStore';
import { useRepairStore } from '../../store/repairStore';
import { Store, Package, MessageSquare, CheckCircle, TrendingUp, PlusCircle, Plus, ArrowRight, TrendingDown, Wrench, Coins, Gem, Gavel, Activity } from 'lucide-react';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { getStoresByVendor } = useStoreStore();
    const { designs } = useDesignStore();
    const { getInquiriesByStore } = useInquiryStore();
    const { getAllRepairs } = useRepairStore();

    const [stats, setStats] = useState({
        totalStores: 0,
        totalDesigns: 0,
        pendingInquiries: 0,
        completedVisits: 0,
        activeRepairRequests: 0,
        quotesProvided: 0,
        totalVisits: 0
    });
    const [recentInquiries, setRecentInquiries] = useState([]);

    const [categoryStats, setCategoryStats] = useState([]);

    useEffect(() => {
        if (user) {
            const vendorStores = getStoresByVendor(user.id);
            const storeIds = vendorStores.map(s => s.id);

            // Get designs for vendor's stores
            const vendorDesigns = designs.filter(d => storeIds.includes(d.storeId));

            // Get all inquiries for vendor's stores
            let allInquiries = [];
            storeIds.forEach(storeId => {
                allInquiries = [...allInquiries, ...getInquiriesByStore(storeId)];
            });

            const pending = allInquiries.filter(i => i.status === 'pending').length;
            const completed = allInquiries.filter(i => i.status === 'completed').length;

            // Get repair stats
            const allRepairs = getAllRepairs();
            const activeRepairs = allRepairs.filter(r => r.status === 'posted' || r.status === 'vendor_contacted').length;

            // Count quotes provided by this vendor
            let quotesCount = 0;
            allRepairs.forEach(repair => {
                if (repair.quotes) {
                    quotesCount += repair.quotes.filter(q => q.vendorId === user.id).length;
                }
            });

            setStats({
                totalStores: vendorStores.length,
                totalDesigns: vendorDesigns.length,
                pendingInquiries: pending,
                completedVisits: completed,
                activeRepairRequests: activeRepairs,
                quotesProvided: quotesCount,
                totalVisits: parseInt(localStorage.getItem('totalVisits') || '0')
            });

            // Get recent 5 inquiries
            setRecentInquiries(allInquiries.slice(0, 5));

            // Calculate Category Stats
            const catMap = {};
            vendorDesigns.forEach(d => {
                const cat = d.category || 'Uncategorized';
                catMap[cat] = (catMap[cat] || 0) + 1;
            });

            const catStats = Object.keys(catMap).map(cat => ({
                name: cat,
                count: catMap[cat],
                percentage: vendorDesigns.length > 0 ? Math.round((catMap[cat] / vendorDesigns.length) * 100) : 0
            })).sort((a, b) => b.count - a.count);

            setCategoryStats(catStats);
        }

        // Real-time update listener for storage events (cross-tab)
        const handleStorageChange = (e) => {
            if (e.key === 'totalVisits') {
                setStats(prev => ({
                    ...prev,
                    totalVisits: parseInt(e.newValue || '0')
                }));
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Fallback polling
        const interval = setInterval(() => {
            const currentVisits = parseInt(localStorage.getItem('totalVisits') || '0');
            setStats(prev => {
                if (prev.totalVisits !== currentVisits) {
                    return { ...prev, totalVisits: currentVisits };
                }
                return prev;
            });
        }, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [user, designs]);

    const statCards = [
        {
            label: 'Total Visits (Traffic)',
            value: stats.totalVisits.toLocaleString(),
            icon: Activity,
            textColor: 'text-gold',
            trend: 'Live',
            trendUp: true
        },
        {
            label: 'Total Stores',
            value: stats.totalStores,
            icon: Store,
            textColor: 'text-gold-dark',
            trend: '+0',
            trendUp: true
        },
        {
            label: 'Total Designs',
            value: stats.totalDesigns,
            icon: Package,
            textColor: 'text-gray-800',
            trend: '+0',
            trendUp: true
        },
        {
            label: 'Pending Inquiries',
            value: stats.pendingInquiries,
            icon: MessageSquare,
            textColor: 'text-gold-dark',
            trend: 'Action Req',
            trendUp: false
        },
    ];

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gold/20">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
                                Welcome back, <span className="text-gold-dark">{user?.name}</span>
                            </h1>
                            <p className="text-gray-500 font-sans tracking-wide uppercase text-xs">
                                Your Boutique Overview
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gold/20">
                                <Activity className="w-4 h-4 text-gold animate-pulse" />
                                <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div key={index} className="bg-ivory p-6 border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300 group rounded-lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-gold/5 rounded-full group-hover:bg-gold/10 transition-colors">
                                        <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                                    </div>
                                    {stat.trend && (
                                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-xs text-gray-500 font-sans uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                {[
                                    { icon: Plus, label: 'New Masterpiece', desc: 'Add a design', path: '/vendor/designs' },
                                    { icon: Store, label: 'Manage Boutiques', desc: 'Update store details', path: '/vendor/stores' },
                                    { icon: Wrench, label: 'Repairs', desc: 'View repair requests', path: '/vendor/repair-requests' },
                                    { icon: Coins, label: 'Gold Pawn', desc: 'View pawn requests', path: '/vendor/pawn-requests' },
                                    { icon: Gem, label: 'Buy Gold', desc: 'View sell requests', path: '/vendor/sell-requests' },
                                    { icon: Gavel, label: 'Gold Auctions', desc: 'Bid on auctions', path: '/vendor/auctions' },
                                    { icon: MessageSquare, label: 'View Inquiries', desc: 'Check customer messages', path: '/vendor/inquiries' },
                                ].map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(action.path)}
                                        className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 hover:border-gold hover:shadow-md transition-all duration-300 text-left group rounded-md"
                                    >
                                        <div className="p-2 bg-gray-50 group-hover:bg-gold/10 rounded-full transition-colors">
                                            <action.icon className="w-4 h-4 text-gray-400 group-hover:text-gold" />
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-gray-900 text-sm group-hover:text-gold-dark transition-colors">{action.label}</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{action.desc}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gold group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Inquiries Preview */}
                        <div className="lg:col-span-2 bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-serif font-bold text-gray-900">Recent Inquiries</h2>
                                <button onClick={() => navigate('/vendor/inquiries')} className="text-xs font-bold text-gold hover:text-gold-dark uppercase tracking-widest transition-colors">
                                    View All
                                </button>
                            </div>

                            {recentInquiries.length > 0 ? (
                                <div className="space-y-4">
                                    {recentInquiries.slice(0, 3).map(inq => (
                                        <div key={inq.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-gold/30 transition-all rounded-md">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-serif font-bold">
                                                    {inq.customerName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{inq.customerName}</h4>
                                                    <p className="text-xs text-gray-500">Interested in a design</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${inq.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-green-50 text-green-700 border-green-200'
                                                    }`}>
                                                    {inq.status}
                                                </span>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(inq.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-center bg-white border border-dashed border-gray-200 rounded-md">
                                    <MessageSquare className="w-8 h-8 text-gray-200 mb-2" />
                                    <p className="text-gray-500 font-serif italic text-sm">No inquiries yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
