import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // HomePage import edildi
import HotelPage from './pages/HotelPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import CommentPage from './pages/CommentPage';
import HotelList from './components/HotelList';
import RoomPage from './components/RoomPage';
import UsersPage from './pages/UsersPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ana Sayfa */}
        <Route path="/" element={<HomePage />} />
        
        {/* Diğer Sayfalar */}
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/hotels/:hotelId" element={<HotelPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/comments" element={<CommentPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/rooms" element={<RoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
