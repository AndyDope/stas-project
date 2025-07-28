import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			// This now correctly reads the standardized object from localStorage
			const storedData = JSON.parse(localStorage.getItem("user"));
			if (storedData && storedData.user) {
				setUser(storedData.user);
			}
		} catch (error) {
			localStorage.removeItem("user");
		}
		setIsLoading(false);
	}, []);

	const login = async (credentials) => {
		const responseData = await authService.login(credentials);
		// This now receives the standardized object and works correctly
		if (responseData && responseData.user) {
			setUser(responseData.user);
		}
		return responseData;
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
