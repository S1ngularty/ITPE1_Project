import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/components/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-icon">⚙</span> ScrewSort
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
      </div>

      <button className="navbar-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
