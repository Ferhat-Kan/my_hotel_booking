import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting login form with:', formData);
        try {
            const response = await axios.post('http://localhost:8000/users/login', {
                username: formData.username,
                password: formData.password,
            }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.access_token);
            console.log('Token stored:', localStorage.getItem('token'));
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                fullWidth
                label="Email"
                name="username"
                type="email"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                margin="normal"
                required
            />

            <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
