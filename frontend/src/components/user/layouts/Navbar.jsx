import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/user/components/navbar.css";
import SearchBar from "../search-bar";
import useNavbar from "../../../hooks/user/useNavbar";
import ConfirmationModal from "../ConfirmationModal";
import FilterContainer from "../FilterContainer";
import SavedScrewsModal from "../SavedScrewsModal";
import { Filter, Bookmark } from "lucide-react";

function Navbar({ searchKeyword, applyResult }) {
  const { isLogin, setShowModal, showModal, filterData } = useNavbar();
  const [showFilter, setShowFilter] = useState(false);
  const [showSavedScrews, setShowSavedScrews] = useState(false);
  const navigate = useNavigate();

  // Fetch saved screws when modal opens
  const handleShowSavedScrews = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    
    
    setShowSavedScrews(true);
  };

  // Handle unlike screw
  const handleUnlikeScrew = async (screwId) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/user/saved-screws/${screwId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Successfully removed from backend
        console.log('Screw removed from saved');
      }
    } catch (error) {
      console.error('Error removing screw:', error);
    }
  };

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <nav className="navbar">
      {showModal && (
        <ConfirmationModal
          show={true}
          mode={"logout"}
          onClose={() => setShowModal(false)}
          onConfirm={handleLogout}
        />
      )}

      <SavedScrewsModal
        isOpen={showSavedScrews}
        onClose={() => setShowSavedScrews(false)}
        onUnlikeScrew={handleUnlikeScrew}
      />

      <div className="navbar-logo">
        <span className="navbar-icon">⚙</span> ScrewIT
      </div>

      <div className="navbar-center">
        <SearchBar
          keyword={typeof searchKeyword === "function" ? searchKeyword : null}
        />
        <button
          className="filter-button"
          onClick={() => setShowFilter((prev) => !prev)}>
          <Filter size={20} />
        </button>
        {showFilter && (
          <FilterContainer data={filterData} applyResult={applyResult} />
        )}
      </div>

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
          
          {/* Saved Screws Button */}
          <button
            className="navbar-saved-button"
            onClick={handleShowSavedScrews}
            title="View saved screws"
          >
            <Bookmark size={20} />
            <span className="saved-count">
            </span>
          </button>
        </div>
      )}

      <button
        className="navbar-button"
        onClick={isLogin ? () => setShowModal(true) : handleLogin}>
        {isLogin ? "Logout" : "Sign in"}
      </button>
    </nav>
  );
}

export default Navbar;