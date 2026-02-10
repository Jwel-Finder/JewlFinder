import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useStoreStore } from './store/storeStore';
import { useDesignStore } from './store/designStore';
import { useInquiryStore } from './store/inquiryStore';
import { initializeDummyData } from './utils/dummyData';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';
import StoreDetailsPage from './pages/customer/StoreDetailsPage';
import DesignDetailsPage from './pages/customer/DesignDetailsPage';
import InquiryPage from './pages/customer/InquiryPage';
import InquiryConfirmationPage from './pages/customer/InquiryConfirmationPage';
import VisitStatusPage from './pages/customer/VisitStatusPage';
import CategoryVendorsPage from './pages/customer/CategoryVendorsPage';
import WalletPage from './pages/customer/WalletPage';
import TransactionHistoryPage from './pages/customer/TransactionHistoryPage';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import StoreManagement from './pages/vendor/StoreManagement';
import DesignManagement from './pages/vendor/DesignManagement';
import InquiryManagement from './pages/vendor/InquiryManagement';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StoreApprovalPage from './pages/admin/StoreApprovalPage';
import VendorApprovalPage from './pages/admin/VendorApprovalPage';
import PlatformMonitoring from './pages/admin/PlatformMonitoring';

import './index.css';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  const { initAuth } = useAuthStore();
  const { initStores } = useStoreStore();
  const { initDesigns } = useDesignStore();
  const { initInquiries } = useInquiryStore();

  // Initialize app on mount
  useEffect(() => {
    initializeDummyData();
    initAuth();
    initStores();
    initDesigns();
    initInquiries();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              (() => {
                const { isAuthenticated, role } = useAuthStore();
                if (!isAuthenticated) return <Navigate to="/login" replace />;

                switch (role) {
                  case 'admin': return <Navigate to="/admin/dashboard" replace />;
                  case 'vendor': return <Navigate to="/vendor/dashboard" replace />;
                  case 'customer': return <Navigate to="/customer/home" replace />;
                  default: return <Navigate to="/login" replace />;
                }
              })()
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Customer Routes */}
            <Route
              path="/customer/home"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerHome />
                </ProtectedRoute>
              }
            />
            {/* ... other customer routes ... */}
            <Route
              path="/customer/stores"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/store/:storeId"
              element={
                <ProtectedRoute requiredRole="customer">
                  <StoreDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/design/:designId"
              element={
                <ProtectedRoute requiredRole="customer">
                  <DesignDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/inquiry/:designId"
              element={
                <ProtectedRoute requiredRole="customer">
                  <InquiryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/inquiry-confirmation"
              element={
                <ProtectedRoute requiredRole="customer">
                  <InquiryConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/inquiries"
              element={
                <ProtectedRoute requiredRole="customer">
                  <VisitStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/category/:category"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CategoryVendorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/wallet"
              element={
                <ProtectedRoute requiredRole="customer">
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/transaction-history"
              element={
                <ProtectedRoute requiredRole="customer">
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/stores"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <StoreManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/designs"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <DesignManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/inquiries"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <InquiryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/wallet"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/transaction-history"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute requiredRole="admin">
                  <VendorApprovalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute requiredRole="admin">
                  <StoreApprovalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/monitor"
              element={
                <ProtectedRoute requiredRole="admin">
                  <PlatformMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/wallet"
              element={
                <ProtectedRoute requiredRole="admin">
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transaction-history"
              element={
                <ProtectedRoute requiredRole="admin">
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
