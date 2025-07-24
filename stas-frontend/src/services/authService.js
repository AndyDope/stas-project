// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Your backend URL

const register = (userData) => {
  // userData: { name, email, password, roleId }
  return axios.post(`${API_URL}/register`, userData);
};

const login = (credentials) => {
  // credentials: { email, password }
  return axios.post(`${API_URL}/login`, credentials).then((response) => {
    if (response.data.token) {
      // Store user info and JWT token
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
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