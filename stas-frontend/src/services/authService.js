import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth';

const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials).then((response) => {
        // The raw data from your backend API
        const responsetData = response.data;

        // We store the NEW, standardized object in localStorage
        if (responsetData.token) {
            localStorage.setItem('user', JSON.stringify(responsetData));
        }

        // We return the NEW, standardized object to the AuthContext
        return responsetData;
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

export default {
    register,
    login,
    logout,
};