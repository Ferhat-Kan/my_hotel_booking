import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Button, 
    Rating,
    Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await api.getHotels();
                setHotels(response.data);
            } catch (error) {
                console.error('Error loading hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Hotels
            </Typography>
            <Grid container spacing={3}>
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`https://source.unsplash.com/random/400x200/?hotel&${hotel.id}`}
                                alt={hotel.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {hotel.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {hotel.location}
                                </Typography>
                                <Rating value={hotel.rating} readOnly precision={0.5} />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {hotel.description}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}
                                >
                                    View Rooms
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default HotelList; 