import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert,
    Paper,
    Grid,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './BookingForm.css';

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId, hotelName, roomPrice } = location.state || {};

    const [formData, setFormData] = useState({
        guest_name: '',
        check_in_date: null,
        check_out_date: null
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.check_in_date || !formData.check_out_date) {
            setError('Please select a date');
            return;
        }

        try {
            const bookingData = {
                room_id: roomId,
                guest_name: formData.guest_name,
                check_in_date: formData.check_in_date.toISOString().split('T')[0],
                check_out_date: formData.check_out_date.toISOString().split('T')[0],
                payment_method: "none"
            };

            const response = await api.createBooking(bookingData);
            navigate('/payment/new', { 
                state: { 
                    bookingId: response.data.id,
                    amount: calculateTotalAmount(formData)
                }
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Booking could not be created. Please try again.');
        }
    };

    const calculateTotalAmount = (formData) => {
        if (!formData.check_in_date || !formData.check_out_date) return 0;
        const diffTime = Math.abs(formData.check_out_date - formData.check_in_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * location.state.roomPrice;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                    Booking
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {hotelName}
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Guest Name"
                                name="guest_name"
                                value={formData.guest_name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    guest_name: e.target.value
                                })}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Check-in Date"
                                value={formData.check_in_date}
                                onChange={(date) => setFormData({
                                    ...formData,
                                    check_in_date: date
                                })}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                minDate={new Date()}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Check-out Date"
                                value={formData.check_out_date}
                                onChange={(date) => setFormData({
                                    ...formData,
                                    check_out_date: date
                                })}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                minDate={formData.check_in_date || new Date()}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Total Amount: {calculateTotalAmount(formData)} EUR
                    </Typography>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Complete Booking
                    </Button>
                </Box>
            </Paper>
        </LocalizationProvider>
    );
};

export default BookingForm; 