import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { API_URL } from '../config';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [hotel, setHotel] = useState(null);
    const { hotelId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsResponse, hotelResponse] = await Promise.all([
                    api.getRooms(hotelId),
                    api.getHotelById(hotelId)
                ]);
                setRooms(roomsResponse.data);
                setHotel(hotelResponse.data);
            } catch (error) {
                console.error('Error loading rooms:', error);
            }
        };

        fetchData();
    }, [hotelId]);

    const handleBooking = (roomId, roomPrice) => {
        navigate(`/booking/new`, { 
            state: { roomId, hotelId, hotelName: hotel?.name, roomPrice } 
        });
    };

    if (!hotel) return null;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {hotel.name} - Rooms
            </Typography>
            <Grid container spacing={3}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={room.image_url ? `${API_URL}/${room.image_url}` : 'default_image_url.jpg'}
                                alt={room.room_number}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Room {room.room_number}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {room.room_type}
                                </Typography>
                                <Box sx={{ mt: 1, mb: 2 }}>
                                    <Chip 
                                        label={room.is_available ? 'Available' : 'Occupied'} 
                                        color={room.is_available ? 'success' : 'error'}
                                    />
                                </Box>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    {room.price_per_night} EUR / Night
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    disabled={!room.is_available}
                                    onClick={() => handleBooking(room.id, room.price_per_night)}
                                >
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RoomList;
