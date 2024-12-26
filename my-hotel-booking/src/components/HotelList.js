import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HotelList.css";
import UpdateHotelModal from "./UpdateHotelModal"; // Modal dosyasını ekliyoruz

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null); // Güncellenecek oteli seçmek için
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    rating: "",
    description: "",
  }); // Yeni otel form verileri

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/hotels");
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleUpdateClick = (hotel) => {
    setSelectedHotel(hotel); // Güncellenecek oteli seçiyoruz
  };

  const handleModalClose = () => {
    setSelectedHotel(null); // Modal kapandığında seçimi sıfırla
    fetchHotels(); // Listeyi güncelle
  };

  const handleDeleteHotel = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/hotels/${id}`);
      fetchHotels();
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  const handleAddHotelChange = (e) => {
    const { name, value } = e.target;
    setNewHotel({ ...newHotel, [name]: value });
  };

  const handleAddHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/hotels", newHotel);
      setNewHotel({ name: "", location: "", rating: "", description: "" }); // Formu sıfırla
      fetchHotels(); // Listeyi güncelle
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  return (
    <div className="container">
      {/* Add New Hotel */}
      <div className="add-hotel">
        <h2>Add New Hotel</h2>
        <form onSubmit={handleAddHotelSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newHotel.name}
              onChange={handleAddHotelChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={newHotel.location}
              onChange={handleAddHotelChange}
              required
            />
          </label>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={newHotel.rating}
              onChange={handleAddHotelChange}
              min="1"
              max="5"
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={newHotel.description}
              onChange={handleAddHotelChange}
              required
            />
          </label>
          <button type="submit" className="btn-add">Add Hotel</button>
        </form>
      </div>

      {/* Hotel List */}
      <div className="hotel-list">
        <h2>Hotel List</h2>
        <table className="hotel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.location}</td>
                <td>{hotel.rating}</td>
                <td>{hotel.description}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdateClick(hotel)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteHotel(hotel.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {selectedHotel && (
        <UpdateHotelModal
          hotel={selectedHotel}
          onClose={handleModalClose}
          fetchHotels={fetchHotels}
        />
      )}
    </div>
  );
};

export default HotelList;
