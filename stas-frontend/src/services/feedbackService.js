import axios from "axios";

const API_URL = "http://localhost:80/api/feedback"; // The single endpoint for all feedback

const getAuthHeaders = () => {
  const storedData = JSON.parse(localStorage.getItem("user"));
  if (storedData && storedData.token) {
    return { Authorization: "Bearer " + storedData.token };
  }
  return {};
};
// Helper function to get Client ID
const getId = () => {
  const storedData = JSON.parse(localStorage.getItem("user"));
  if (storedData && storedData.user && storedData.user.id) {
    return storedData.user.id;
  }
  return 0;
};

/**
 * Submits new feedback. The backend will know the author from the JWT token.
 * @param {object} feedbackData - Can be { projectId, rating, content } for clients
 *                              OR { taskId, recipientId, rating, content } for managers.
 */
const submitFeedback = (feedbackData) => {
    return axios.post(`${API_URL}/client`, feedbackData, { headers: getAuthHeaders() });
};

/**
 * Fetches the feedback history for the currently logged-in user (either given or received).
 */
const getMyFeedbackHistory = () => {
  return axios.get(`${API_URL}/client/history`, {
    headers: getAuthHeaders(),
    params: { id: getId() },
  });
};

export default {
  submitFeedback,
  getMyFeedbackHistory,
};
