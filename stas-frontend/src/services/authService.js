// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth'; // Keep this for later

const register = (userData) => {
  // We can also mock registration if needed
  console.log('Mock register called with:', userData);
  return Promise.resolve({ data: { message: 'User registered successfully!' } });
};

// ===================================================================
// MOCKED LOGIN FUNCTION FOR TESTING
// This function simulates a call to the backend.
// ===================================================================
const login = (credentials) => {
  console.log('Mock login initiated with credentials:', credentials);

  return new Promise((resolve, reject) => {
    // Simulate a 1-second network delay
    setTimeout(() => {
      let mockResponse = null;

      // Check the email to determine which role to return
      if (credentials.email === 'manager@test.com') {
        mockResponse = {
          token: 'fake-jwt-token-for-manager',
          user: { id: 1, name: 'Manager User', email: 'manager@test.com', role: { roleName: 'MANAGER' } },
        };
      } else if (credentials.email === 'client@test.com') {
        mockResponse = {
          token: 'fake-jwt-token-for-client',
          user: { id: 2, name: 'Client User', email: 'client@test.com', role: { roleName: 'CLIENT' } },
        };
      } else if (credentials.email === 'admin@test.com') {
        mockResponse = {
          token: 'fake-jwt-token-for-admin',
          user: { id: 3, name: 'Admin User', email: 'admin@test.com', role: { roleName: 'ADMIN' } },
        };
      } else if (credentials.email === 'dev@test.com') {
        mockResponse = {
          token: 'fake-jwt-token-for-developer',
          user: { id: 4, name: 'Developer User', email: 'dev@test.com', role: { roleName: 'DEVELOPER' } },
        };
      }

      if (mockResponse) {
        console.log('Mock login successful. Returning user:', mockResponse.user);
        // On success, we still "store" the fake data in localStorage
        localStorage.setItem('user', JSON.stringify(mockResponse));
        resolve(mockResponse); // Resolve the promise with the fake data
      } else {
        console.log('Mock login failed. Invalid credentials.');
        // On failure, reject the promise with a fake error object
        reject({ response: { data: { message: 'Invalid credentials. Use a test email.' } } });
      }
    }, 1000); // 1000ms = 1 second delay
  });
};

// ===================================================================
// ORIGINAL JWT LOGIN FUNCTION (COMMENTED OUT FOR LATER)
// ===================================================================
/*
const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials).then((response) => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};
*/
// ===================================================================

const logout = () => {
  // Logout doesn't need a backend call, so it works as is.
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};