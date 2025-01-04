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
  const { roomId, hotelName, roomPrice } = location.state || {}; // Retrieve roomId from state
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in_date: "",
    check_out_date: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // 'success' or 'error'
  const navigate = useNavigate();

  const userId = 1; // Example user ID
  const status = "pending"; // Default status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...formData,
        user_id: userId,
        room_id: roomId, // Use roomId from state
        status: status,
      };
      console.log("Booking Data:", bookingData);
      const response = await axios.post("http://127.0.0.1:8000/bookings", bookingData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponseMessage("Booking successfully created!");
      setResponseType("success");
      console.log("Response:", response.data);

      // Navigate to payment form after successful booking
      setTimeout(() => {
        navigate("/payment/new", { state: { bookingId: response.data.id, amount: calculateTotalAmount() } });
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      let errorMessage = "Failed to create booking.";
      if (error.response) {
        console.error("Error Response:", error.response.data);
        switch (error.response.status) {
          case 404:
            errorMessage = "Room not found.";
            break;
          case 400:
            errorMessage = error.response.data.detail || "Invalid booking details.";
            break;
          default:
            errorMessage = "An unexpected error occurred.";
        }
      }
      setResponseMessage(errorMessage);
      setResponseType("error");
      console.error("Error:", error);
    }
  };

  const calculateTotalAmount = () => {
    if (!formData.check_in_date || !formData.check_out_date) {
      return 0; // Return 0 if any required field is missing
    }
    const checkInDate = new Date(formData.check_in_date);
    const checkOutDate = new Date(formData.check_out_date);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * roomPrice; // Use roomPrice from state
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
              type="text"
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
