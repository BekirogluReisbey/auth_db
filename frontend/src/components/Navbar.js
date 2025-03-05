// src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/welcome">Home</Link></li>
        
        {/* Links basierend auf der Benutzerrolle anzeigen */}
        {user?.role === "admin" && <li><Link to="/admin">Admin Bereich</Link></li>}
        {user?.role === "supervisor" && <li><Link to="/supervisor">Supervisor Bereich</Link></li>}
        {user?.role === "user" && <li><Link to="/user">User Bereich</Link></li>}
        
        {/* Logout-Button anzeigen, wenn Benutzer eingeloggt ist */}
        {user ? (
          <li><button onClick={logout}>Logout</button></li>
        ) : (
          <li><Link to="/">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
