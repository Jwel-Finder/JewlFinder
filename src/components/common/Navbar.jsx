import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, X, LogOut, Home, Store, Package, MessageSquare, Users, Settings, User, ArrowUp, ArrowDown, Wallet, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SidePanel from './SidePanel';
import GlobalMessagingPanel from '../panels/GlobalMessagingPanel';

const Navbar = () => {
    const { user, role, logout } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showGlobalMessaging, setShowGlobalMessaging] = useState(false);
    const userDropdownRef = useRef(null);

    // Metals (gold/silver) live prices
    const [metals, setMetals] = useState({
        gold: { price: null, prev: null, change: null, changePct: null },
        silver: { price: null, prev: null, change: null, changePct: null }
    });
    const [metalsLoading, setMetalsLoading] = useState(true);
    const [metalsError, setMetalsError] = useState(null);
    const [metalsUpdatedAt, setMetalsUpdatedAt] = useState(null);

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
    // Formatter to display currency symbols and localized grouping
    let formatter;
    try {
        formatter = new Intl.NumberFormat(effectiveBaseCurrency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: effectiveBaseCurrency, maximumFractionDigits: 2 });
    } catch (e) {
        // Fallback to simple formatting
        formatter = { format: (v) => `${currencySymbol}${Number(v).toFixed(2)}` };
    }

    // Small inline sparkline renderer (prev and curr values)
    function Sparkline({ prev, curr, width = 40, height = 18, stroke = '#10b981' }) {
        if (prev == null || curr == null) return null;
        const min = Math.min(prev, curr);
        const max = Math.max(prev, curr);
        const range = max - min || 1; // avoid div by zero
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

    const fetchMetals = async () => {
        setMetalsLoading(true);
        setMetalsError(null);
        try {
            const key = import.meta.env.VITE_METALS_API_KEY;
            const baseUrl = effectiveApiUrl;
            const baseCurrency = effectiveBaseCurrency;
            if (!key) {
                setMetalsError('No API key set (VITE_METALS_API_KEY)');
                setMetalsLoading(false);
                return;
            }

            const OUNCE_TO_GRAM = 31.1034768;

            // Latest prices (MetalPriceAPI expects api_key and currencies params)
            const latestUrl = `${baseUrl}/latest?api_key=${key}&base=${baseCurrency}&currencies=XAU,XAG`;
            const latestRes = await fetch(latestUrl);
            const latest = await latestRes.json();
            const goldLatestRate = latest?.rates?.XAU ?? latest?.data?.rates?.XAU ?? latest?.data?.XAU ?? null;
            const silverLatestRate = latest?.rates?.XAG ?? latest?.data?.rates?.XAG ?? latest?.data?.XAG ?? null;

            // Yesterday close for daily movement
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString().split('T')[0];

            // Try two common historical endpoints for compatibility
            let prev = {};
            try {
                const prevUrl1 = `${baseUrl}/historical?date=${dateStr}&api_key=${key}&base=${baseCurrency}&currencies=XAU,XAG`;
                const prevRes1 = await fetch(prevUrl1);
                if (prevRes1.ok) prev = await prevRes1.json();
                else {
                    const prevUrl2 = `${baseUrl}/${dateStr}?api_key=${key}&base=${baseCurrency}&currencies=XAU,XAG`;
                    const prevRes2 = await fetch(prevUrl2);
                    if (prevRes2.ok) prev = await prevRes2.json();
                }
            } catch (err) {
                prev = {};
            }

            const goldPrevRate = prev?.rates?.XAU ?? prev?.data?.rates?.XAU ?? prev?.data?.XAU ?? null;
            const silverPrevRate = prev?.rates?.XAG ?? prev?.data?.rates?.XAG ?? prev?.data?.XAG ?? null;

            // API returns XAU/XAG per base (e.g., XAU per INR). Invert to get base per XAU (price per oz), then convert to per gram.
            const goldPricePerOunce = goldLatestRate ? (1 / goldLatestRate) : null;
            const silverPricePerOunce = silverLatestRate ? (1 / silverLatestRate) : null;
            const goldPrevPerOunce = goldPrevRate ? (1 / goldPrevRate) : null;
            const silverPrevPerOunce = silverPrevRate ? (1 / silverPrevRate) : null;

            const goldPricePerGram = goldPricePerOunce ? (goldPricePerOunce / OUNCE_TO_GRAM) : null;
            const silverPricePerGram = silverPricePerOunce ? (silverPricePerOunce / OUNCE_TO_GRAM) : null;
            const goldPrevPerGram = goldPrevPerOunce ? (goldPrevPerOunce / OUNCE_TO_GRAM) : null;
            const silverPrevPerGram = silverPrevPerOunce ? (silverPrevPerOunce / OUNCE_TO_GRAM) : null;

            const goldChange = (goldPricePerGram !== null && goldPrevPerGram !== null) ? goldPricePerGram - goldPrevPerGram : null;
            const silverChange = (silverPricePerGram !== null && silverPrevPerGram !== null) ? silverPricePerGram - silverPrevPerGram : null;
            const goldPct = (goldChange !== null && goldPrevPerGram) ? (goldChange / goldPrevPerGram) * 100 : null;
            const silverPct = (silverChange !== null && silverPrevPerGram) ? (silverChange / silverPrevPerGram) * 100 : null;

            setMetals({
                gold: { price: goldPricePerGram, prev: goldPrevPerGram, change: goldChange, changePct: goldPct },
                silver: { price: silverPricePerGram, prev: silverPrevPerGram, change: silverChange, changePct: silverPct }
            });
            setMetalsUpdatedAt(new Date().toISOString());
            setMetalsLoading(false);
        } catch (err) {
            setMetalsError('Failed to fetch metals data');
            setMetalsLoading(false);
        }
    }; 

    useEffect(() => {
        fetchMetals();
        const id = setInterval(fetchMetals, pollIntervalSecondsEffective * 1000);
        return () => clearInterval(id);
    }, [pollIntervalSecondsEffective, effectiveApiUrl, effectiveBaseCurrency]);


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
