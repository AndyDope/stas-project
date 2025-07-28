import axios from 'axios';

// We need to get the token from localStorage to authorize these requests
const API_URL = 'http://localhost:80/api/dashboard';

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const storedData = JSON.parse(localStorage.getItem('user'));
    if (storedData && storedData.token) {        
        return { Authorization: 'Bearer ' + storedData.token };
    }
    return {};
};

// Helper function to get Client ID
const getId = () => {
    const storedData = JSON.parse(localStorage.getItem('user'));
    if (storedData && storedData.user && storedData.user.id) {        
        return storedData.user.id;
    }
    return 0;
};

// Get client stats for dashboard
const getClientDashboardStats = () => {
    return axios.get(`${API_URL}/client-stats/${getId()}`, { headers: getAuthHeaders() });
};

export default {
    getClientDashboardStats
};