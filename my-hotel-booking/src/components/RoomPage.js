import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomPage.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    hotel_id: '',
    room_number: '',
    room_type: '',
    price_per_night: 0,
    is_available: true,
  });
  const [editRoom, setEditRoom] = useState(null);

  // Odaları yükleme
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/rooms');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Oda ekleme
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/rooms', newRoom);
      setRooms([...rooms, newRoom]);
      setNewRoom({
        hotel_id: '',
        room_number: '',
        room_type: '',
        price_per_night: 0,
        is_available: true,
      });
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  // Oda güncelleme
  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/rooms/${editRoom.id}`, editRoom);
      setRooms(
        rooms.map((room) =>
          room.id === editRoom.id ? { ...editRoom } : room
        )
      );
      setEditRoom(null);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  // Oda silme
  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/rooms/${id}`);
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Form değişikliklerini işleme
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editRoom) {
      setEditRoom({ ...editRoom, [name]: value });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="container">
      <h2>Rooms List</h2>

      {/* Oda ekleme formu */}
      <form onSubmit={handleAddRoom}>
        <h3>Add Room</h3>
        <input
          type="text"
          name="hotel_id"
          value={newRoom.hotel_id}
          onChange={handleChange}
          placeholder="Hotel ID"
        />
        <input
          type="text"
          name="room_number"
          value={newRoom.room_number}
          onChange={handleChange}
          placeholder="Room Number"
        />
        <input
          type="text"
          name="room_type"
          value={newRoom.room_type}
          onChange={handleChange}
          placeholder="Room Type"
        />
        <input
          type="number"
          name="price_per_night"
          value={newRoom.price_per_night}
          onChange={handleChange}
          placeholder="Price per Night"
        />
        <label>
          Available:
          <input
            type="checkbox"
            name="is_available"
            checked={newRoom.is_available}
            onChange={(e) =>
              setNewRoom({ ...newRoom, is_available: e.target.checked })
            }
          />
        </label>
        <button type="submit">Add Room</button>
      </form>

      {/* Oda güncelleme formu */}
      {editRoom && (
        <form onSubmit={handleUpdateRoom}>
          <h3>Update Room</h3>
          <input
            type="text"
            name="hotel_id"
            value={editRoom.hotel_id}
            onChange={handleChange}
            placeholder="Hotel ID"
          />
          <input
            type="text"
            name="room_number"
            value={editRoom.room_number}
            onChange={handleChange}
            placeholder="Room Number"
          />
          <input
            type="text"
            name="room_type"
            value={editRoom.room_type}
            onChange={handleChange}
            placeholder="Room Type"
          />
          <input
            type="number"
            name="price_per_night"
            value={editRoom.price_per_night}
            onChange={handleChange}
            placeholder="Price per Night"
          />
          <label>
            Available:
            <input
              type="checkbox"
              name="is_available"
              checked={editRoom.is_available}
              onChange={(e) =>
                setEditRoom({ ...editRoom, is_available: e.target.checked })
              }
            />
          </label>
          <button type="submit">Update Room</button>
        </form>
      )}

      {/* Oda listesi */}
      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Hotel ID</th>
            <th>Room Type</th>
            <th>Price per Night</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.room_number}</td>
                <td>{room.hotel_id}</td>
                <td>{room.room_type}</td>
                <td>{room.price_per_night}</td>
                <td>{room.is_available ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => setEditRoom(room)}>Edit</button>
                  <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-rooms">
                No rooms available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsPage;
