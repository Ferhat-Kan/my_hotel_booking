import React from 'react';
import { Link } from 'react-router-dom';  // Link import edildi

const HotelPage = () => {
  return (
    <div>
      <h1>Hotel Page</h1>
      <p>Welcome to the hotel page!</p>

      {/* Linkler burada kullanılacak */}
      <Link to="/">Go to Home</Link>
      <Link to="/hotels">View Hotels</Link>
      <Link to="/rooms">View Rooms</Link>
      <Link to="/users">View Users</Link>
      <Link to="/bookings">View Bookings</Link>
      <Link to="/payments">View Payments</Link>
      <Link to="/comments">View Comments</Link>
    </div>
  );
};

export default HotelPage;
