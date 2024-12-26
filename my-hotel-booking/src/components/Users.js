import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Token'ı almak
        const response = await axios.get("http://localhost:8000/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data); // API'den gelen veriyi set et
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.full_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
