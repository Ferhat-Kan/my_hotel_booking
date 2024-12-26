import React, { useState } from "react";
import axios from "axios";
import "./UpdateHotelModal.css";

const UpdateHotelModal = ({ hotel, onClose, fetchHotels }) => {
  const [formData, setFormData] = useState({
    name: hotel.name || "",
    location: hotel.location || "",
    rating: hotel.rating || "",
    description: hotel.description || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/hotels/${hotel.id}/`, formData);
      fetchHotels(); // Otel listesini yenile
      onClose(); // Modalı kapat
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Hotel</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </label>
          <div className="modal-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHotelModal;
