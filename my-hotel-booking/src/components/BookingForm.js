import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = () => {
    const [roomId, setRoomId] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = { room_id: roomId, check_in_date: checkInDate, check_out_date: checkOutDate };

        try {
            const response = await axios.post('http://localhost:8000/bookings/', bookingData);
            console.log('Booking successful', response.data);
        } catch (error) {
            console.error('Error creating booking', error.response);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Room ID:</label>
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} required />
            <label>Check-in Date:</label>
            <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
            <label>Check-out Date:</label>
            <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
            <button type="submit">Create Booking</button>
        </form>
    );
};

export default BookingForm;
