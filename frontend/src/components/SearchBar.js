import React, { useState } from 'react';
import { Box, TextField, Button, Grid } from '@mui/material';
import { api } from '../services/api';

const SearchBar = ({ onSearch }) => {
    const [searchCriteria, setSearchCriteria] = useState({
        location: '',
        checkInDate: '',
        checkOutDate: '',
        roomCount: 1,
        guestCount: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
    };

    const handleSearch = async () => {
        try {
            const response = await api.getHotels({ location: searchCriteria.location });
            onSearch(response.data);
        } catch (error) {
            console.error('Error searching hotels:', error);
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={searchCriteria.location}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Check-In Date"
                        name="checkInDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={searchCriteria.checkInDate}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Check-Out Date"
                        name="checkOutDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={searchCriteria.checkOutDate}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1}>
                    <TextField
                        fullWidth
                        label="Rooms"
                        name="roomCount"
                        type="number"
                        value={searchCriteria.roomCount}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1}>
                    <TextField
                        fullWidth
                        label="Guests"
                        name="guestCount"
                        type="number"
                        value={searchCriteria.guestCount}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1}>
                    <Button variant="contained" fullWidth onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchBar; 