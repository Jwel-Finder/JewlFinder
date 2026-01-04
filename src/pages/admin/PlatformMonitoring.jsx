import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Activity, Server, AlertTriangle, CheckCircle, XCircle, Info, Download, RefreshCw, MoreHorizontal } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PlatformMonitoring = () => {
    // Mock data for charts and logs
    const activityLogs = [
        { id: 1, action: 'New Vendor Registration', user: 'Jewels by Jain', time: '2 mins ago', type: 'info' },
        { id: 2, action: 'Store Approval Request', user: 'Royal Gems', time: '15 mins ago', type: 'warning' },
        { id: 3, action: 'System Backup', user: 'System', time: '1 hour ago', type: 'success' },
        { id: 4, action: 'Failed Login Attempt', user: 'Unknown IP', time: '2 hours ago', type: 'error' },
        { id: 5, action: 'New Design Added', user: 'Diamond Palace', time: '3 hours ago', type: 'info' },
    ];

    const trafficData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Page Views',
                data: [1200, 1900, 1500, 2200, 2800, 3500, 3100],
                borderColor: '#D4AF37', // Gold
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Unique Visitors',
                data: [800, 1200, 1000, 1500, 1800, 2200, 2000],
                borderColor: '#000000', // Black
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderDash: [5, 5],
                tension: 0.4,
            },
        ],
    };

    const serverStats = [
        { label: 'CPU Usage', value: 45, color: 'bg-green-500' },
        { label: 'Memory Usage', value: 62, color: 'bg-yellow-500' },
        { label: 'Storage', value: 28, color: 'bg-blue-500' },
    ];

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: {
                        family: 'Lato'
                    }
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'info': return <Info className="w-5 h-5 text-blue-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Activity className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-cream py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gold/20">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">Platform Pulse</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-xs">Real-time system performance & activity monitoring</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <Download className="w-3 h-3" /> Export Logs
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-black text-white hover:bg-gold hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest shadow-md">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">Traffic Overview</h2>
                        <div className="h-64 w-full">
                            <Line data={trafficData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Server Stats */}
                    <div className="bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">System Health</h2>
                        <div className="space-y-6">
                            {serverStats.map((stat, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1 font-sans">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-xs font-bold text-gray-900">{stat.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                        <div
                                            className={`h-1 ${stat.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${stat.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-gray-100 mt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-green-50 rounded-full">
                                        <Server className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Server Status</p>
                                        <p className="text-green-600 font-bold text-sm">Operational</p>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                    Last checked: {new Date().toLocaleTimeString()} • v2.4.0
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Logs */}
                    <div className="lg:col-span-3 bg-ivory p-6 border border-gold/10 shadow-sm rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-serif font-bold text-gray-900">Recent Activity</h2>
                            <span className="text-[10px] font-bold text-gold uppercase tracking-widest cursor-pointer hover:underline">View All Logs</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activityLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getLogIcon(log.type)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-serif font-medium text-gray-900 text-sm">{log.action}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-xs text-gray-600 font-sans">{log.user}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{log.time}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <button className="text-gray-400 hover:text-black transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformMonitoring;
