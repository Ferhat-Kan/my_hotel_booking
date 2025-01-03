import React, { useEffect } from "react";
import axios from "axios";

const RoomPriceFetcher = ({ roomId, onPriceFetched }) => {
  useEffect(() => {
    const fetchRoomPrice = async () => {
      if (!roomId) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/rooms/${roomId}`);
        const roomPrice = response.data.price; // Ensure the response contains a 'price' field
        onPriceFetched(roomPrice);
      } catch (error) {
        console.error("Error fetching room price:", error);
      }
    };

    fetchRoomPrice();
  }, [roomId, onPriceFetched]);

  return null; // This component doesn't render anything
};

export default RoomPriceFetcher; 