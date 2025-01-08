import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navigation from './components/Navigation';
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
import CreateComment from './components/CreateComment';
import ApproveComment from './components/ApproveComment';
import commentService from './services/commentService';

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
                    <Route path="/create-comment" element={<CreateComment />} />
                    <Route path="/comments" element={<CommentList />} />
                    <Route path="/approve-comment" element={<ApproveComment />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App; 