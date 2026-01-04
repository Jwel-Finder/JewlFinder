import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Unauthorized</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <Navigate to="/login" replace />
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
