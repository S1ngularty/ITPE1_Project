import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/user/components/navbar.css";
import SearchBar from "../search-bar";
import useNavbar from "../../../hooks/user/useNavbar";

function Navbar({ searchKeyword }) {
  const { isLogin } = useNavbar();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleLogin(){
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-icon">⚙</span> ScrewIT
      </div>
      <SearchBar
        keyword={typeof searchKeyword === "function" ? searchKeyword : null}
      />
      {isLogin && (
        <div className="navbar-links">
          <Link to="/home" className="navbar-link">
            Home
          </Link>
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          <Link to="/save-analyses" className="navbar-link">
            Save Analyses
          </Link>
        </div>
      )}

      <button className="navbar-button" onClick={isLogin ? handleLogout : handleLogin}>
        {isLogin ? "Logout" : "Sign in"}
      </button>
    </nav>
  );
}

export default Navbar;
