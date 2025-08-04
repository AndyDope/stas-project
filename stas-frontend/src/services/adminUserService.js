import axios from "axios";

const API_URL = "http://localhost:80/api/admin";

const getAuthHeaders = () => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if(storedData && storedData.token){
        return {Authorization: "Bearer " + storedData.token};
    }
    return {};
}

//Fetch all users for admin management
const fetchAllUsers = () => {
    return axios.get(`${API_URL}/manage-users`, {
        headers: getAuthHeaders(),
    });
}

//Update User
const updateUser = (userId, updatedData) => {
    return axios.put(`${API_URL}/manage-users/${userId}`, updatedData, {
        headers: getAuthHeaders(),
    });
};

//Delete User
const deleteUser = (userId) => {
    return axios.delete(`${API_URL}/manage-users/${userId}`, {
        headers: getAuthHeaders(),
    });
};

const createAdminUser = (adminData) => {
    return axios.post(`${API_URL}/create-admin`, adminData, {
        headers: getAuthHeaders(),
    });
}

export{
    fetchAllUsers,
    updateUser,
    deleteUser,
    createAdminUser,
};