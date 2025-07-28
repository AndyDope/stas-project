import axios from 'axios';

// We need to get the token from localStorage to authorize these requests
const API_URL = 'http://localhost:80/api/auth';

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const storedData = JSON.parse(localStorage.getItem('user'));
    if (storedData && storedData.token) {
        return { Authorization: 'Bearer ' + storedData.token };
    }
    return {};
};

/**
 * Fetches the profile of the currently logged-in user.
 */
const getMyProfile = () => {
    return axios.get(`${API_URL}/me`, { headers: getAuthHeaders() });
};

/**
 * Updates the profile of the currently logged-in user.
 * @param {object} profileData - The data to update (e.g., { name, email })
 */
const updateMyProfile = (profileData) => {
    return axios.put(`${API_URL}/me`, profileData, { headers: getAuthHeaders() });
};

/**
 * Updates the password of the currently logged-in user.
 * @param {object} passwordData - { oldPassword, newPassword }
 */
const changePassword = (passwordData) => {
    return axios.put(`${API_URL}/me/change-password`, passwordData, { headers: getAuthHeaders() });
};

export default {
    getMyProfile,
    updateMyProfile,
    changePassword,
};