import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/hotels">Hotels</Link></li>
                <li><Link to="/bookings">Bookings</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
