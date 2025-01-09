import axios from "axios";

// Set the base URL for the FastAPI backend
const API_URL = "http://localhost:8000/comments"; // Change this to the correct URL

// Function to create a new comment
export const createComment = async (commentData, token) => {
  const response = await axios.post(API_URL, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Function to fetch comments
export const fetchComments = async (bookingId, skip, limit) => {
  const response = await axios.get(API_URL, {
    params: { booking_id: bookingId, skip, limit },
  });
  return response.data;
};

// Function to approve a comment (admin only)
export const approveComment = async (commentId, token) => {
  const response = await axios.put(`${API_URL}/${commentId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
