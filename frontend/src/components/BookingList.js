import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.getBookings();
                setBookings(response.data);
            } catch (error) {
                console.error('Error loading bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            {bookings.map(booking => (
                <div key={booking.id}>
                    <h3>{booking.guest_name}</h3>
                    <p>Status: {booking.status}</p>
                    {/* Other booking details */}
                </div>
            ))}
        </div>
    );
};

export default BookingList; 