import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '../utils/getResponse';
import { toast } from 'sonner';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
                credentials: 'include', // This is important for cookies
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            setUser(data.user);
            setIsAuth(true);
        } catch (error) {
            console.error('Profile fetch error:', error);
            setUser(null);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        setUser(userData);
        setIsAuth(true);
    };

    const logout = async () => {
        try {
            await fetch(`${BACKEND_URL}/api/v1/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuth(false);
        }
    };

    const updateUser = (updatedUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUserData
        }));
    };

    const value = {
        user,
        isAuth,
        loading,
        login,
        logout,
        updateUser,
        fetchProfile
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
