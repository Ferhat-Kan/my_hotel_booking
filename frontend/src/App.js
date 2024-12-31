import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { Container } from '@mui/material';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HotelList from './components/HotelList';
import RoomList from './components/RoomList';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import BookingList from './components/BookingList';
import CommentList from './components/CommentList';
import UserList from './components/UserList';
import LandingPage from './components/LandingPage';

function App() {
    return (
        <Router>
            <Navigation />
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/hotels" element={<HotelList />} />
                    <Route path="/hotels/:hotelId/rooms" element={<RoomList />} />
                    <Route path="/booking/new" element={<BookingForm />} />
                    <Route path="/payment/new" element={<PaymentForm />} />
                    <Route path="/bookings" element={<BookingList />} />
                    <Route path="/comments/new/:bookingId" element={<CommentList />} />
                    <Route path="/users" element={<UserList />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App; 