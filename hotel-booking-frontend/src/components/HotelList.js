import React from 'react';

const HotelList = () => {
  const hotels = ['Hotel A', 'Hotel B', 'Hotel C'];

  return (
    <div>
      <h2>Available Hotels</h2>
      <ul>
        {hotels.map((hotel, index) => (
          <li key={index}>{hotel}</li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;
