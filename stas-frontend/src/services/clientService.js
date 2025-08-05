import axios from 'axios';

// We need to get the token from localStorage to authorize these requests
const API_URL = 'http://localhost:80/api/client';

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const storedData = JSON.parse(localStorage.getItem('user'));
    if (storedData && storedData.token) {
        return { Authorization: 'Bearer ' + storedData.token };
    }
    return {};
};

// Get client stats for dashboard
const getClientDashboardStats = () => {
    return axios.get(`${API_URL}/dashboard-data`, { headers: getAuthHeaders() });
};

/**
 * Fetches a paginated list of projects for the currently logged-in client.
 * The backend will identify the client via their JWT token.
 * @param {number} page - The page number to fetch (0-indexed for the API).
 * @param {number} limit - The number of items per page.
 */
const getProjects = (page, limit) => {
    return axios.get(`${API_URL}/projects`, {
        headers: getAuthHeaders(),
        params: {
            page: page,
            limit: limit
        }
    });
};

// Creating new project
const createNewProject = (newProject) => {
    return axios.post(`${API_URL}/project`, newProject, { headers: getAuthHeaders() });
}

const getProjectById = (projectId) => {
    return axios.get(`${API_URL}/projects/${projectId}`, { headers: getAuthHeaders() });
}

/**
 * NEW FUNCTION: Updates the details for a specific project.
 * @param {number} projectId - The ID of the project to update.
 * @param {object} projectData - The data to update (e.g., { title, description, endDate }).
 */
const updateProject = (projectId, projectData) => {
    return axios.put(`${API_URL}/projects/${projectId}`, projectData, { headers: getAuthHeaders() });
};

/**
 * Fetches a list of all managers with their project counts.
 */
const getAvailableManagers = () => {
    return axios.get(`${API_URL}/available-managers`, { headers: getAuthHeaders() });
};

export default {
    getClientDashboardStats,
    getProjects,
    createNewProject,
    getProjectById,
    updateProject,
    getAvailableManagers,
};