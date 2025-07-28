import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const storedData = JSON.parse(localStorage.getItem("user"));
			if (storedData && storedData.user) {
				setUser(storedData.user);
			}
		} catch (error) {
			console.error("Failed to parse user from localStorage", error);
			localStorage.removeItem("user");
		}
		setIsLoading(false);
	}, []);

	const login = async (credentials) => {
		const responseData = await authService.login(credentials);
		if (responseData && responseData.user) {
			setUser(responseData.user);
		}
		return responseData;
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	// This function updates the user state and syncs it with localStorage.
	const updateUser = (newUserData) => {
		console.log(newUserData);

		// Create a new object to guarantee a state change triggers re-renders
		const updatedUser = { ...user, ...newUserData };
		setUser(updatedUser);

		try {
			const storedData = JSON.parse(localStorage.getItem("user"));
			if (storedData) {
				// Update the 'user' property within the stored object
				const updatedStorage = { ...storedData, user: updatedUser };
				localStorage.setItem("user", JSON.stringify(updatedStorage));
			}
		} catch (error) {
			console.error("Failed to update user in localStorage", error);
		}
	};

	const value = {
		user,
		login,
		logout,
		updateUser,
		isAuthenticated: !!user,
		isLoading,
	};

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
