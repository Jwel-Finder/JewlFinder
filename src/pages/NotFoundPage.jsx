import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gold-50">
            <div className="text-center px-4">
                <div className="mb-8">
                    <span className="text-9xl">💎</span>
                </div>
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to={(() => {
                        try {
                            const user = JSON.parse(localStorage.getItem('jewel_auth_user'));
                            const role = user?.role;
                            if (!role) return '/login';

                            switch (role) {
                                case 'admin': return '/admin/dashboard';
                                case 'vendor': return '/vendor/dashboard';
                                case 'customer': return '/customer/home';
                                default: return '/login';
                            }
                        } catch (e) {
                            return '/login';
                        }
                    })()}
                    className="inline-flex items-center gap-2 gradient-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
