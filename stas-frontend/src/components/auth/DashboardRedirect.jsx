import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const getDashboardPath = (roleName) => {
	if (!roleName) return "/login";
	const role = roleName.toUpperCase();
	switch (role) {
		case "ADMIN":
			return "/admin/dashboard";
		case "MANAGER":
			return "/manager/dashboard";
		case "CLIENT":
			return "/client/dashboard";
		case "DEVELOPER":
			return "/developer/dashboard";
		default:
			return "/login";
	}
};

const DashboardRedirect = () => {
	const { user } = useAuth();
	const dashboardPath = getDashboardPath(user?.role?.roleName);
	return <Navigate to={dashboardPath} replace />;
};

export default DashboardRedirect;
