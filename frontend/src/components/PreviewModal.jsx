import React, { useEffect, useState } from "react";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/pages/PreviewModal.css";

const ScrewPreviewModal = ({ id, onClose }) => {
  const [screw, setScrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const fetchScrew = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}api/v1/screw/${id}`
      );
      const data = await res.json();
      console.log("Fetched screw data:", data); // Debug log
      setScrew(data.result);
    } catch (err) {
      console.error("Error fetching screw:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchScrew();
  }, [id]);

  const nextImage = () => {
    if (screw?.images?.length > 0) {
      setCurrentImg((prev) => (prev + 1) % screw.images.length);
    }
  };

  const prevImage = () => {
    if (screw?.images?.length > 0) {
      setCurrentImg(
        (prev) => (prev - 1 + screw.images.length) % screw.images.length
      );
    }
  };

  const toggleFavorite = () => {
    setFavorited((prev) => !prev);
  };

  // Fallback content if data is missing
  const getDisplayText = (text, fallback = "Not specified") => {
    return text || fallback;
  };

  if (loading) {
    return (
      <div className="screwdetails-loading">
        <div className="spinner"></div>
        <p>Loading screw details...</p>
      </div>
    );
  }

  if (!screw) {
    return (
      <div className="screwdetails-empty">
        <p>Failed to load screw details.</p>
        <button className="retry-btn" onClick={fetchScrew}>
          Try Again
        </button>
      </div>
    );
  }

  console.log("Rendering screw:", screw); // Debug log

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header with title and action buttons */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Product Details</h2>
          </div>
          <div className="modal-actions">
            <button
              className={`modal-btn fav-btn ${favorited ? "active" : ""}`}
              onClick={toggleFavorite}
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }>
              <Heart size={20} fill={favorited ? "currentColor" : "none"} />
            </button>
            <button
              className="modal-btn close-btn"
              onClick={onClose}
              aria-label="Close modal">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Main content */}
        {/* Image carousel */}
        <div className="screwdetails-images">
          {screw.images && screw.images.length > 0 ? (
            <div className="image-carousel">
              <button
                className="nav-btn left"
                onClick={prevImage}
                aria-label="Previous image">
                <ChevronLeft size={24} />
              </button>

              <div className="image-container">
                <img
                  src={screw.images[currentImg].url}
                  alt={`${screw.name} image`}
                  className="screwdetails-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                {screw.images.length > 1 && (
                  <div className="image-indicator">
                    {currentImg + 1} / {screw.images.length}
                  </div>
                )}
              </div>

              <button
                className="nav-btn right"
                onClick={nextImage}
                aria-label="Next image">
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <div className="screwdetails-placeholder">
              <div className="placeholder-icon">📷</div>
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="screwdetails-info">
          <div className="product-header">
            <h1 className="screwdetails-name">{getDisplayText(screw.name)}</h1>
            <p className="screwdetails-category">
              {getDisplayText(screw.category)}
            </p>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Material:</span>
              <span className="spec-value">
                {getDisplayText(screw.material)}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Strength:</span>
              <span className="spec-value">
                {getDisplayText(screw.strength)}
              </span>
            </div>
            <div className="spec-item full-width">
              <span className="spec-label">Available Sizes:</span>
              <span className="spec-value">
                {screw.sizes && screw.sizes.length > 0
                  ? screw.sizes.join(", ")
                  : "Not specified"}
              </span>
            </div>
          </div>

          <div className="screwdetails-section">
            <h3 className="section-title">Description</h3>
            <p className="section-content">
              {getDisplayText(screw.description, "No description available.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrewPreviewModal;
