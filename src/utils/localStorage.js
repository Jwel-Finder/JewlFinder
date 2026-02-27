// LocalStorage utility functions

export const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return null;
    }
};

export const setToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting ${key} to localStorage:`, error);
        return false;
    }
};

export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
        return false;
    }
};

// Auth specific helpers
export const getAuthUser = () => {
    return getFromStorage('jewel_auth_user');
};

export const setAuthUser = (user) => {
    return setToStorage('jewel_auth_user', user);
};

export const clearAuthUser = () => {
    return removeFromStorage('jewel_auth_user');
};

// Data specific helpers
export const getUsers = () => {
    return getFromStorage('jewel_users') || [];
};

export const setUsers = (users) => {
    return setToStorage('jewel_users', users);
};

export const getStores = () => {
    return getFromStorage('jewel_stores') || [];
};

export const setStores = (stores) => {
    return setToStorage('jewel_stores', stores);
};

export const getDesigns = () => {
    return getFromStorage('jewel_designs') || [];
};

export const setDesigns = (designs) => {
    return setToStorage('jewel_designs', designs);
};

export const getInquiries = () => {
    return getFromStorage('jewel_inquiries') || [];
};

export const setInquiries = (inquiries) => {
    return setToStorage('jewel_inquiries', inquiries);
};

export const getRepairs = () => {
    return getFromStorage('jewel_repairs') || [];
};

export const setRepairs = (repairs) => {
    return setToStorage('jewel_repairs', repairs);
};

// Save a new user
export const saveUser = (user) => {
    try {
        const users = getUsers();
        users.push(user);
        return setUsers(users);
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
};

// Update user status (for admin approval)
export const updateUserStatus = (userId, status) => {
    try {
        const users = getUsers();
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, status } : u
        );
        return setUsers(updatedUsers);
    } catch (error) {
        console.error('Error updating user status:', error);
        return false;
    }
};
