import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/users">Users</Link> {/* Kullanıcılar sayfası */}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
