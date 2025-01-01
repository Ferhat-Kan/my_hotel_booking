import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Backend API URL'nizi kontrol edin

// Axios ile API çağrıları için bir yapı oluşturuyoruz
export const api = {
    
    getHotels: (criteria) => axios.get(`${API_URL}/hotels`, { params: criteria }),
    getHotelById: (id) => axios.get(`${API_URL}/hotels/${id}`),
    getRooms: (hotelId, skip = 0, limit = 100) => axios.get(`${API_URL}/rooms`, { params: { hotel_id: hotelId, skip, limit } }),
    createBooking: (bookingData) => axios.post(`${API_URL}/bookings`, bookingData),
    getBookings: () => axios.get(`${API_URL}/bookings`),
    createPayment: (paymentData) => axios.post(`${API_URL}/payments`, paymentData),
    getComments: (bookingId) => axios.get(`${API_URL}/comments`, { params: { booking_id: bookingId } }),
    createComment: (commentData) => axios.post(`${API_URL}/comments`, commentData),
    getUsers: () => axios.get(`${API_URL}/users`),
    register: (userData) => axios.post(`${API_URL}/users/register`, userData),
    login: (formData) => axios.post(`${API_URL}/users/login`, formData)
}; 