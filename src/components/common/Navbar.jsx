import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useMetalsStore } from '../../store/metalsStore';
import { Menu, X, LogOut, Home, Store, Package, MessageSquare, Users, Settings, User, ArrowUp, ArrowDown, Wallet, Mail, Gem, Receipt } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SidePanel from './SidePanel';
import GlobalMessagingPanel from '../panels/GlobalMessagingPanel';

const Navbar = () => {
    const { user, role, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showGlobalMessaging, setShowGlobalMessaging] = useState(false);
    const userDropdownRef = useRef(null);

    // Metals (gold/silver) live prices – shared store
    const { metals, loading: metalsLoading, error: metalsError, updatedAt: metalsUpdatedAt, isMock, startPolling, stopPolling } = useMetalsStore();

    // Runtime app settings (non-sensitive config)
    const [appSettings, setAppSettings] = useState(null);

    useEffect(() => {
        fetch('/appsettings.json')
            .then((res) => { if (!res.ok) throw new Error('Failed to load appsettings'); return res.json(); })
            .then(setAppSettings)
            .catch(() => setAppSettings(null));
    }, []);

    const effectiveApiUrl = appSettings?.metals?.apiUrl ?? import.meta.env.VITE_METALS_API_URL ?? 'https://api.metalpriceapi.com/v1';
    const effectiveBaseCurrency = appSettings?.metals?.baseCurrency ?? import.meta.env.VITE_METALS_BASE ?? 'INR';
    const pollIntervalSecondsEffective = Number(appSettings?.metals?.pollIntervalSeconds ?? import.meta.env.VITE_METALS_POLL_INTERVAL ?? 60);

    const currencySymbol = effectiveBaseCurrency === 'INR' ? '₹' : effectiveBaseCurrency === 'USD' ? '$' : `${effectiveBaseCurrency} `;
    let formatter;
    try {
        formatter = new Intl.NumberFormat(effectiveBaseCurrency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: effectiveBaseCurrency, maximumFractionDigits: 2 });
    } catch (e) {
        formatter = { format: (v) => `${currencySymbol}${Number(v).toFixed(2)}` };
    }

    // Small inline sparkline renderer
    function Sparkline({ prev, curr, width = 40, height = 18, stroke = '#10b981' }) {
        if (prev == null || curr == null) return null;
        const min = Math.min(prev, curr);
        const max = Math.max(prev, curr);
        const range = max - min || 1;
        const x0 = 2;
        const x1 = width - 2;
        const y = (v) => height - ((v - min) / range) * height;
        const y0 = y(prev);
        const y1 = y(curr);
        const lineColor = curr >= prev ? stroke : '#ef4444';
        return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block align-middle" aria-hidden>
                <polyline points={`${x0},${y0} ${x1},${y1}`} fill="none" stroke={lineColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={x1} cy={y1} r="1.6" fill={lineColor} />
            </svg>
        );
    }

    // Start polling via shared store
    useEffect(() => {
        const apiKey = import.meta.env.VITE_METALS_API_KEY;
        startPolling(effectiveApiUrl, effectiveBaseCurrency, apiKey, pollIntervalSecondsEffective);
        return () => stopPolling();
    }, [effectiveApiUrl, effectiveBaseCurrency, pollIntervalSecondsEffective]);


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Role-based navigation items
    const getNavItems = () => {
        if (!role) return [];

        switch (role) {
            case 'customer':
                return [
                    { label: 'Home', path: '/customer/home', icon: Home },
                    { label: 'Collections', path: '/customer/stores', icon: Store },
                    { label: 'My Vault', path: '/customer/inquiries', icon: MessageSquare }
                ];
            case 'vendor':
                return [
                    { label: 'Dashboard', path: '/vendor/dashboard', icon: Home },
                    { label: 'My Boutique', path: '/vendor/stores', icon: Store },
                    { label: 'Catalog', path: '/vendor/designs', icon: Package },
                    { label: 'Billing', path: '/vendor/billing', icon: Receipt },
                    { label: 'Inquiries', path: '/vendor/inquiries', icon: MessageSquare }
                ];
            case 'admin':
                return [
                    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
                    { label: 'Vendors', path: '/admin/vendors', icon: Users },
                    { label: 'Stores', path: '/admin/stores', icon: Store },
                    { label: 'Monitor', path: '/admin/monitor', icon: Settings }
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    if (!user) return null;

    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gold/10">
                <div className="w-full px-4">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to={role === 'customer' ? '/customer/home' : `/${role}/dashboard`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                                <span className="text-xl">✨</span>
                            </div>
                            <span className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
                                House of <span className="text-gold">Gold</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gold-dark transition font-sans text-sm tracking-wide uppercase"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Metals Live Prices */}
                        <div className="hidden md:flex items-center gap-6 ml-6" title={metalsUpdatedAt ? `Updated ${new Date(metalsUpdatedAt).toLocaleTimeString()}` : ''}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="font-sans uppercase">Gold</span>
                                    <span className="font-bold text-gray-900">{metals.gold.price !== null ? `${formatter.format(metals.gold.price)}/g` : '—'}</span>
                                    {metals.gold.changePct !== null && (
                                        <>
                                            <span className={`flex items-center gap-1 ${metals.gold.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {metals.gold.changePct >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                <span className="text-xs">{(metals.gold.changePct >= 0 ? '+' : '-')}{Math.abs(metals.gold.changePct).toFixed(2)}%</span>
                                            </span>
                                            <span className="ml-2 inline-flex items-center"><Sparkline prev={metals.gold.prev} curr={metals.gold.price} stroke="#10b981" /></span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="font-sans uppercase">Silver</span>
                                    <span className="font-bold text-gray-900">{metals.silver.price !== null ? `${formatter.format(metals.silver.price)}/g` : '—'}</span>
                                    {metals.silver.changePct !== null && (
                                        <>
                                            <span className={`flex items-center gap-1 ${metals.silver.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {metals.silver.changePct >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                <span className="text-xs">{(metals.silver.changePct >= 0 ? '+' : '-')}{Math.abs(metals.silver.changePct).toFixed(2)}%</span>
                                            </span>
                                            <span className="ml-2 inline-flex items-center"><Sparkline prev={metals.silver.prev} curr={metals.silver.price} stroke="#10b981" /></span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Actions Group - Messages & Profile */}
                        <div className="hidden md:flex items-center gap-3" ref={userDropdownRef}>
                            {/* Messages Icon (Customer Only) */}
                            {role === 'customer' && (
                                <button
                                    onClick={() => setShowGlobalMessaging(true)}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition shadow-sm relative group"
                                    title="Messages"
                                >
                                    <Mail className="w-5 h-5" />
                                    {/* Unread Badge */}
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full group-hover:scale-110 transition-transform"></span>
                                </button>
                            )}

                            {/* User Profile Icon */}
                            <button
                                onClick={() => setShowUserDropdown((s) => !s)}
                                aria-expanded={showUserDropdown}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition shadow-sm relative"
                            >
                                <User className="w-5 h-5" />
                            </button>
                            {showUserDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                                    <div className="p-3">
                                        <p className="text-sm font-serif font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gold uppercase tracking-widest mb-3">{role}</p>
                                        <button
                                            onClick={() => { setShowUserDropdown(false); navigate(`/${role}/wallet`); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded mb-1"
                                        >
                                            <Wallet className="w-4 h-4" />
                                            My Wallet
                                        </button>
                                        <button
                                            onClick={() => { setShowUserDropdown(false); handleLogout(); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gold transition"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100 bg-white">
                            <div className="flex flex-col gap-4">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 text-gray-700 hover:text-gold transition font-sans text-sm uppercase tracking-wide px-4 py-2"
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                {/* Messages Button in Mobile Menu (Customer Only) */}
                                {role === 'customer' && (
                                    <button
                                        onClick={() => {
                                            setShowGlobalMessaging(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-gray-700 hover:text-gold transition font-sans text-sm uppercase tracking-wide px-4 py-2 w-full"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>Messages</span>
                                        <span className="ml-auto w-2 h-2 bg-gold rounded-full"></span>
                                    </button>
                                )}

                                <div className="pt-4 border-t border-gray-100 px-4">
                                    <div className="flex justify-between items-center text-sm text-gray-700 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase text-xs text-gray-500">Gold</span>
                                            <span className="font-semibold">{metals.gold.price !== null ? `${formatter.format(metals.gold.price)}/g` : '—'}</span>
                                            {metals.gold.changePct !== null && (
                                                <span className={`text-xs ${metals.gold.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metals.gold.changePct >= 0 ? '+' : '-')}{Math.abs(metals.gold.changePct).toFixed(2)}%</span>
                                            )}
                                            <span className="ml-2 inline-flex items-center"><Sparkline prev={metals.gold.prev} curr={metals.gold.price} stroke="#10b981" /></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase text-xs text-gray-500">Silver</span>
                                            <span className="font-semibold">{metals.silver.price !== null ? `${formatter.format(metals.silver.price)}/g` : '—'}</span>
                                            {metals.silver.changePct !== null && (
                                                <span className={`text-xs ${metals.silver.changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(metals.silver.changePct >= 0 ? '+' : '-')}{Math.abs(metals.silver.changePct).toFixed(2)}%</span>
                                            )}
                                            <span className="ml-2 inline-flex items-center"><Sparkline prev={metals.silver.prev} curr={metals.silver.price} stroke="#10b981" /></span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-serif font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gold uppercase tracking-widest mb-4">{role}</p>
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); navigate(`/${role}/wallet`); }}
                                        className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 uppercase tracking-widest text-xs hover:bg-gold hover:text-white transition w-full justify-center mb-2"
                                    >
                                        <Wallet className="w-4 h-4" />
                                        My Wallet
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 uppercase tracking-widest text-xs hover:bg-black hover:text-white transition w-full justify-center"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Global Messaging Panel - Outside nav element */}
            {role === 'customer' && (
                <SidePanel
                    isOpen={showGlobalMessaging}
                    onClose={() => setShowGlobalMessaging(false)}
                    title="Messages"
                >
                    <GlobalMessagingPanel
                        onSelectConversation={(conversation) => {
                            console.log('Selected conversation:', conversation);
                            setShowGlobalMessaging(false);
                            // TODO: Navigate to specific conversation or open messaging panel
                        }}
                    />
                </SidePanel>
            )}
        </>
    );
};

export default Navbar;
