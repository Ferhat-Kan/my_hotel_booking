import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './PaymentForm.css';

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, amount } = location.state || {};

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        payment_method: 'credit_card'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const paymentData = {
                booking_id: bookingId,
                amount: amount,
                payment_method: formData.payment_method,
                status: 'PENDING'
            };

            const response = await api.createPayment(paymentData);
            console.log(response.data.message);
            navigate('/bookings');
        } catch (error) {
            console.error('Payment failed:', error);
            setError('Payment failed. Please try again.');
        }
    };

    const handlePayment = async () => {
        const paymentData = {
            booking_id: bookingId,
            amount: amount,
            payment_method: formData.payment_method
        };
        try {
            const response = await api.createPayment(paymentData);
            if (response.status === 200) {
                alert('Payment successful! Your booking is confirmed.');
                navigate('/bookings');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Payment
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={formData.payment_method}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    payment_method: e.target.value
                                })}
                            >
                                <MenuItem value="credit_card">Credit Card</MenuItem>
                                <MenuItem value="debit_card">Debit Card</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({
                                ...formData,
                                cardNumber: e.target.value
                            })}
                            inputProps={{ maxLength: 16 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Card Holder Name"
                            value={formData.cardHolder}
                            onChange={(e) => setFormData({
                                ...formData,
                                cardHolder: e.target.value
                            })}
                            required
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Expiry Date (MM/YY)"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({
                                ...formData,
                                expiryDate: e.target.value
                            })}
                            inputProps={{ maxLength: 5 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="CVV"
                            value={formData.cvv}
                            onChange={(e) => setFormData({
                                ...formData,
                                cvv: e.target.value
                            })}
                            inputProps={{ maxLength: 3 }}
                            required
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Amount to Pay: {amount} EUR
                </Typography>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                >
                    Complete Payment
                </Button>
            </Box>
        </Paper>
    );
};

export default PaymentForm; 