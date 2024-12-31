import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton
} from '@mui/material';
import { Delete, Comment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.getBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    const handleDelete = async (bookingId) => {
        try {
            await api.deleteBooking(bookingId);
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hotel/Room</TableCell>
                            <TableCell>Check-in Date</TableCell>
                            <TableCell>Check-out Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    {booking.room?.hotel?.name} - Room {booking.room?.room_number}
                                </TableCell>
                                <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={booking.status} 
                                        color={getStatusColor(booking.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => navigate(`/comments/new/${booking.id}`)}
                                        disabled={booking.status !== 'completed'}
                                    >
                                        <Comment />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleDelete(booking.id)}
                                        disabled={booking.status === 'completed'}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BookingList; 