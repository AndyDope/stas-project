import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// This component takes an array of allowed roles as a prop
const RoleBasedRoute = ({ allowedRoles }) => {
	const { user } = useAuth();

	// Check if the user object and role exist
	if (!user || !user.role?.roleName) {
		// If no user, redirect to login
		return <Navigate to="/login" replace />;
	}

	const userRole = user.role.roleName.toUpperCase();

	// If the user's role is in the allowedRoles array, render the page.
	// Otherwise, redirect to an "Unauthorized" page.
	return allowedRoles.includes(userRole) ? (
		<Outlet />
	) : (
		<Navigate to="/unauthorized" replace />
	);
};

export default RoleBasedRoute;
