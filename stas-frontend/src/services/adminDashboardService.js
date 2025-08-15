// services/adminDashboardService.js
import axios from "axios";

// Backend API URL for Admin Dashboard
const API_URL = "http://localhost:80/api/admin";

// Get token from localStorage
const getAuthHeaders = () => {
	const storedData = JSON.parse(localStorage.getItem("user"));
	if (storedData && storedData.token) {
		return { Authorization: "Bearer " + storedData.token };
	}
	return {};
};

// (Optional) Get Admin ID from localStorage (future use)
const getAdminId = () => {
	const storedData = JSON.parse(localStorage.getItem("user"));
	if (storedData && storedData.user && storedData.user.id) {
		return storedData.user.id;
	}
	return 0;
};

// Fetch Admin Dashboard Stats
const getAdminDashboardStats = () => {
	return axios.get(`${API_URL}/dashboard-data`, {
		headers: getAuthHeaders(),
	});
};

export default {
	getAdminDashboardStats,
	getAdminId, // for future use
};