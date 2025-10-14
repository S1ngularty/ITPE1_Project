import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/components/navbar.css";
import SearchBar from "../search-bar";
function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-icon">⚙</span> ScrewIT
      </div>
          <SearchBar/>
      <div className="navbar-links">
        <Link to="/home" className="navbar-link">
          Home
        </Link>
        <Link to="#" className="navbar-link">
          Dashboard
        </Link>
        <Link to="/profile" className="navbar-link">
          Profile
        </Link>
        <Link to="/save-analyses" className="navbar-link">
          Save Analyses
        </Link>
      </div>

      <button className="navbar-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
