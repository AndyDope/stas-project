import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth';

const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials).then((response) => {
        // The raw data from your backend API
        const flatData = response.data;

        // *** THIS IS THE CRITICAL TRANSFORMATION STEP ***
        // We create a standardized object that our frontend expects.
        const standardizedData = {
            token: flatData.token,
            user: {
                id: flatData.id,
                name: flatData.name,
                email: flatData.email,
                // We create the nested 'role' object here
                role: {
                    roleName: flatData.roleName
                }
            }
        };

        // We store the NEW, standardized object in localStorage
        if (standardizedData.token) {
            standardizedData.password = credentials.password; //for storing the password temporarily
            localStorage.setItem('user', JSON.stringify(standardizedData));
        }

        // We return the NEW, standardized object to the AuthContext
        return standardizedData;
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