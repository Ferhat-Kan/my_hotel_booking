import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HotelList from './HotelList';
import SearchBar from './SearchBar';
import { api } from '../services/api';

const LandingPage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);

    const handleSearch = async (criteria) => {
        try {
            const response = await api.getHotels(criteria);
            setHotels(response.data);
            navigate('/hotels', { state: { hotels: response.data } });
        } catch (error) {
            console.error('Error fetching hotels:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {/* <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ mr: 1 }}>
                    Login
                </Button>
                <Button variant="outlined" color="primary" onClick={() => navigate('/register')}>
                    Register
                </Button> */}
            </Box>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Welcome to Our Hotel Booking Platform
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
                    Discover and book the best hotels at the best prices
                </Typography>
                <SearchBar onSearch={handleSearch} />
            </Paper>
            <HotelList hotels={hotels} />
        </Container>
    );
};

export default LandingPage; 