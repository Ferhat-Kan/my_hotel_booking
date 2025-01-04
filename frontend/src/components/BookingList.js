import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Alert } from '@mui/material';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseType, setResponseType] = useState(""); // 'success' or 'error'

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/bookings/${bookingId}/cancel`);
            setResponseMessage("Booking successfully cancelled!");
            setResponseType("success");
            // Update the booking list to reflect the cancellation
            setBookings(bookings.map(booking => 
                booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
            ));
        } catch (error) {
            setResponseMessage("Failed to cancel booking.");
            setResponseType("error");
            console.error('Error cancelling booking:', error);
        }
    };

    return (
        <Container style={{ marginTop: '2cm' }}>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>
            {responseMessage && (
                <Alert severity={responseType} sx={{ mt: 2 }}>
                    {responseMessage}
                </Alert>
            )}
            {bookings.map((booking) => (
                <Box key={booking.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
                    <Typography variant="h6">Booking ID: {booking.id}</Typography>
                    <Typography>Guest Name: {booking.guest_name}</Typography>
                    <Typography>Check-in Date: {booking.check_in_date}</Typography>
                    <Typography>Check-out Date: {booking.check_out_date}</Typography>
                    <Typography>Status: {booking.status}</Typography>
                    {booking.status !== 'cancelled' && (
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={() => handleCancelBooking(booking.id)}
                        >
                            Cancel Booking
                        </Button>
                    )}
                </Box>
            ))}
        </Container>
    );
};

export default BookingList; 