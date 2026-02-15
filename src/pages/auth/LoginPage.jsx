import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = login(formData.email, formData.password, formData.role);

    if (result.success) {
      // Navigate based on role
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'vendor':
          navigate('/vendor/dashboard');
          break;
        case 'customer':
          navigate('/customer/home');
          break;
        default:
          navigate('/login');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }

    setLoading(false);
  };

  // Quick fill for demo
  const quickFill = (role) => {
    const credentials = {
      admin: { email: 'admin@jewel.com', password: 'admin123', role: 'admin' },
      vendor: { email: 'vendor1@jewel.com', password: 'vendor123', role: 'vendor' },
      customer: { email: 'customer@jewel.com', password: 'customer123', role: 'customer' },
    };
    setFormData(credentials[role]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-gold-50">
      <main className="h-screen w-full flex overflow-hidden">
        {/* Left - Info Pane */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-6">
          <div className="text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💎</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">House of Gold</h1>
                <p className="mt-2 text-gray-600 max-w-xs">
                  Sign in to your account and explore fine jewelry curated just for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form Pane */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div
            className="w-full max-w-md bg-white shadow rounded-2xl p-6 overflow-auto"
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Login As
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-gold font-bold py-3 px-4 rounded-lg border-2 border-gold shadow-xl hover:shadow-2xl hover:bg-gray-900 transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials and Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <a
                  href="/signup"
                  className="font-medium text-primary-600 hover:text-primary-500 hover:underline"
                >
                  Create Account
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Login:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => quickFill('customer')}
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  Customer
                </button>
                <button
                  onClick={() => quickFill('vendor')}
                  className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  Vendor
                </button>
                <button
                  onClick={() => quickFill('admin')}
                  className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* 
            <footer className="bg-white border-t py-2 text-center text-sm text-gray-500 flex items-center justify-center">
                Demo Application - All data is stored locally
            </footer> */}
    </div>
  );
};

export default LoginPage;
