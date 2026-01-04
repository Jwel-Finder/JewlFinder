import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, X, LogOut, Home, Store, Package, MessageSquare, Users, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, role, logout } = useAuthStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gold/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to={role === 'customer' ? '/customer/home' : `/${role}/dashboard`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                            <span className="text-xl">✨</span>
                        </div>
                        <span className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
                            LUXE <span className="text-gold">GEMS</span>
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

                    {/* User Info & Logout */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-serif font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gold uppercase tracking-widest">{role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2 border border-gray-200 text-gray-600 rounded-none hover:bg-black hover:text-white hover:border-black transition duration-300 font-sans text-sm uppercase tracking-wider"
                        >
                            Logout
                        </button>
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
                            <div className="pt-4 border-t border-gray-100 px-4">
                                <p className="text-sm font-serif font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gold uppercase tracking-widest mb-4">{role}</p>
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
    );
};

export default Navbar;
