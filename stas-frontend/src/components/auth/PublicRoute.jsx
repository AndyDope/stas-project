import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const getDashboardPath = (roleName) => {
	if (!roleName) return "/login"; // Default fallback
	const role = roleName.toUpperCase();
	switch (role) {
		case "ADMIN":
			return "/admin/dashboard";
		case "MANAGER":
			return "/manager/dashboard";
		case "CLIENT":
			return "/client/dashboard";
		case "DEVELOPER":
			return "/developer/dashboard"; // Changed from /tasks for consistency
		default:
			return "/login";
	}
};

const PublicRoute = () => {
	const { user, isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (isAuthenticated && user) {
		const dashboardPath = getDashboardPath(user.role?.roleName);
		return <Navigate to={dashboardPath} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
