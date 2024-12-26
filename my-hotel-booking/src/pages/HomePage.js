import { Link } from 'react-router-dom';
import React from 'react';
import './HomePage.css';  // HomePage.css dosyasını dahil ettik

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-banner">
                <h1>Welcome to the Hotel Booking App</h1>
                <p>Find the best hotels, book your stay, and share your experiences with us!</p>
            </div>

            {/* Navigation Links */}
            <div className="nav-options">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/users" className="nav-link">Users</Link>
                <Link to="/hotels" className="nav-link">Hotels</Link>
                <Link to="/rooms" className="nav-link">Rooms</Link>
                <Link to="/bookings" className="nav-link">Bookings</Link>
                <Link to="/payments" className="nav-link">Payments</Link>
                <Link to="/comments" className="nav-link">Comments</Link>
            </div>
        </div>
    );
}

export default HomePage;
