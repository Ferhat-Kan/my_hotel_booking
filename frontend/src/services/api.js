import axios from 'axios';
import { API_URL } from '../config';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Define API functions
export const createBooking = async (bookingData) => {
    try {
        const response = await apiClient.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error("Error creating booking:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const api = {
    getBookings: () => apiClient.get('/bookings'),
    // Add other API requests here
    getHotels: () => apiClient.get('/hotels'),
    getHotelById: (id) => apiClient.get(`/hotels/${id}`),
    getRooms: (hotelId, skip = 0, limit = 100) => apiClient.get('/rooms', { params: { hotel_id: hotelId, skip, limit } }),
    createPayment: (paymentData) => apiClient.post('/payments', paymentData),
    getComments: (bookingId) => apiClient.get('/comments', { params: { booking_id: bookingId } }),
    createComment: (commentData) => apiClient.post('/comments', commentData),
    getUsers: () => apiClient.get('/users'),
    register: (userData) => apiClient.post('/users/register', userData),
    login: (formData) => apiClient.post('/users/login', formData)
};

export default api; 