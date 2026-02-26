import { create } from 'zustand';
import { getAuthUser, setAuthUser, clearAuthUser, getUsers } from '../utils/localStorage';

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    role: null,
    isInitialized: false,

    // Initialize auth from localStorage
    initAuth: () => {
        const savedUser = getAuthUser();
        if (savedUser) {
            set({
                user: savedUser,
                isAuthenticated: true,
                role: savedUser.role,
                isInitialized: true
            });
        } else {
            set({ isInitialized: true });
        }
    },

    // Register
    register: (userData) => {
        const users = getUsers();
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
            return { success: false, error: 'User with this email already exists' };
        }

        const newUser = {
            id: `${userData.role}-${Date.now()}`,
            ...userData,
            createdAt: new Date().toISOString().split('T')[0],
            storeIds: [],
            // Vendors are pending by default, customers are approved
            status: userData.role === 'vendor' ? 'pending' : 'approved'
        };

        if (saveUser(newUser)) {
            // Auto login if not vendor (vendors need approval)
            if (newUser.role !== 'vendor') {
                const authUser = {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    storeIds: [],
                    phone: newUser.phone
                };

                setAuthUser(authUser);
                set({
                    user: authUser,
                    isAuthenticated: true,
                    role: authUser.role
                });
            }
            return { success: true, user: newUser };
        }

        return { success: false, error: 'Failed to create account' };
    },

    // Login
    login: (email, password, role) => {
        const users = getUsers();
        const user = users.find(
            u => u.email === email && u.password === password && u.role === role
        );

        if (user) {
            // Check for vendor approval
            if (user.role === 'vendor' && user.status === 'pending') {
                return { success: false, error: 'Your account is pending approval from Admin.' };
            }

            if (user.role === 'vendor' && user.status === 'rejected') {
                return { success: false, error: 'Your account has been rejected.' };
            }

            const authUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                storeIds: user.storeIds || [],
                phone: user.phone || ''
            };

            // Track visits (only for customers)
            if (user.role === 'customer') {
                let currentVisits = parseInt(localStorage.getItem('totalVisits') || '0');
                if (currentVisits < 100) {
                    // Start with a random number between 1000 and 5000 for realistic data
                    currentVisits = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
                }
                localStorage.setItem('totalVisits', (currentVisits + 1).toString());

                // Dispatch storage event manually for same-tab updates (though login usually redirects)
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'totalVisits',
                    newValue: (currentVisits + 1).toString()
                }));
            }

            setAuthUser(authUser);
            set({
                user: authUser,
                isAuthenticated: true,
                role: authUser.role
            });
            return { success: true, user: authUser };
        }

        return { success: false, error: 'Invalid credentials' };
    },

    // Logout
    logout: () => {
        clearAuthUser();
        set({
            user: null,
            isAuthenticated: false,
            role: null
        });
    },

    // Check if user has specific role
    hasRole: (requiredRole) => {
        const { role } = get();
        return role === requiredRole;
    },

    // Get current user
    getUser: () => {
        return get().user;
    }
}));
