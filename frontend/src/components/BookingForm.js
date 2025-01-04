import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const BookingForm = () => {
  const location = useLocation();
  const { roomId, hotelName, roomPrice } = location.state || {};
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in_date: "",
    check_out_date: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const navigate = useNavigate();

  const userId = 1; // Simulated user ID for testing purposes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date to 'yyyy-mm-dd'
    const formattedCheckInDate = new Date(formData.check_in_date)
      .toISOString()
      .split("T")[0];
    const formattedCheckOutDate = new Date(formData.check_out_date)
      .toISOString()
      .split("T")[0];

    const bookingData = {
      user_id: userId,
      room_id: roomId,
      guest_name: formData.guest_name,
      check_in_date: formattedCheckInDate,
      check_out_date: formattedCheckOutDate,
    };

    console.log("Booking Data:", bookingData); // Log the data being sent to the server

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/bookings",
        bookingData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Booking Response:", response.data); // Log server response
      setResponseMessage("Booking successfully created!");
      setResponseType("success");

      setTimeout(() => {
        navigate("/payment/new", {
          state: { bookingId: response.data.id, amount: calculateTotalAmount() },
        });
      }, 2000);
    } catch (error) {
      console.error("Booking Error:", error); // Log error details
      let errorMessage = "Failed to create booking.";
      if (error.response) {
        if (error.response.status === 404) errorMessage = "Room not found.";
        else if (error.response.status === 400)
          errorMessage = error.response.data.detail || "Invalid booking details.";
        else errorMessage = "An unexpected error occurred.";
      }
      setResponseMessage(errorMessage);
      setResponseType("error");
    }
  };

  const calculateTotalAmount = () => {
    if (!formData.check_in_date || !formData.check_out_date || !roomPrice)
      return 0;
    const checkInDate = new Date(formData.check_in_date);
    const checkOutDate = new Date(formData.check_out_date);
    const diffDays = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    return diffDays * roomPrice;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Booking for {hotelName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Guest Name"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              type="date"
              label="Check-in Date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              type="date"
              label="Check-out Date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Booking
          </Button>
        </form>
        {responseMessage && (
          <Alert severity={responseType} sx={{ mt: 2 }}>
            {responseMessage}
          </Alert>
        )}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Amount to Pay: {calculateTotalAmount()} EUR
        </Typography>
      </Paper>
    </Container>
  );
};

export default BookingForm;
