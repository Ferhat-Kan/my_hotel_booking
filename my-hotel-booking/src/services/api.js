import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/', // Backend URL
});

export const createBooking = (bookingData) => api.post('bookings/', bookingData);
export const fetchHotels = () => api.get('hotels/');
export const fetchHotelById = (hotelId) => api.get(`hotels/${hotelId}`);
export const createComment = (commentData) => api.post('comments/', commentData);

export default api;
