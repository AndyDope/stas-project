import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedData = JSON.parse(localStorage.getItem('user'));
            // *** THE FIX: Check if the stored data exists AND has a nested user property ***
            if (storedData && storedData.user) {
                setUser(storedData.user); // Only store the user object
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials) => {
        const responseData = await authService.login(credentials);
        // This part was already correct: we only set the nested user object
        if (responseData && responseData.user) {
            setUser(responseData.user);
        }
        return responseData; // Still return the full response for the login page
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = { user, login, logout, isAuthenticated: !!user, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};