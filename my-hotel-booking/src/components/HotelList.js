import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:8000/hotels/');
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels', error);
            }
        };

        fetchHotels();
    }, []);

    return (
        <div>
            <h2>Hotels</h2>
            <ul>
                {hotels.map((hotel) => (
                    <li key={hotel.id}>
                        {hotel.name} - {hotel.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HotelList;
