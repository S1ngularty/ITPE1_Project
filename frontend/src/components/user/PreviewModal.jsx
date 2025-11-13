import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/user/pages/PreviewModal.css";
import { getToken } from "../../utils/authUtil";

const ScrewPreviewModal = ({ id, onClose }) => {
  const [screw, setScrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();

  const fetchScrew = async () => {
    try {
      let isAuthenticated = getToken()
        ? {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        : {};

      const res = await fetch(
        `${import.meta.env.VITE_APP_API}api/v1/screw/${id}`,
        isAuthenticated
      );
      const data = await res.json();
      console.log(data.result);
      setScrew(data.result.screw);
      if (data.result.isSaved) setFavorited(true);
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

  const toggleFavorite = async () => {
    if (!getToken()) return navigate("/login");
    if (favorited) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_API}api/v1/likes/remove`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ screwId: screw._id }),
          }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();

        if (data) {
          setFavorited(false);
        }
      } catch (err) {
        console.error("Error unsaving the screw:", err);
      }
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_API}api/v1/likes/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ screwId: screw._id }),
          }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();

        if (data) {
          setFavorited(true);
        }
      } catch (err) {
        console.error("Error saving the screw:", err);
      }
    }
  };

  // Helper function to conditionally render fields
  const renderField = (label, value, fallback = "Not specified") => {
    if (!value && value !== 0) return null;
    
    return (
      <div className="spec-item">
        <span className="spec-label">{label}:</span>
        <span className="spec-value">{value || fallback}</span>
      </div>
    );
  };

  // Helper function to render array fields
  const renderArrayField = (label, array, fallback = "Not specified") => {
    if (!array || !Array.isArray(array) || array.length === 0) return null;
    
    return (
      <div className="spec-item full-width">
        <span className="spec-label">{label}:</span>
        <span className="spec-value">{array.join(", ")}</span>
      </div>
    );
  };

  // Helper function to render torque fields
  const renderTorqueField = () => {
    if (!screw.torque) return null;

    const { maxTorqueNm, recommendedTorqueNm, recommendedTightness } = screw.torque;
    
    if (!maxTorqueNm && !recommendedTorqueNm && !recommendedTightness) return null;

    return (
      <div className="torque-section">
        <h4 className="subsection-title">Torque Specifications</h4>
        <div className="subsection-content">
          {maxTorqueNm && (
            <div className="spec-item">
              <span className="spec-label">Max Torque:</span>
              <span className="spec-value">{maxTorqueNm} Nm</span>
            </div>
          )}
          {recommendedTorqueNm && (
            <div className="spec-item">
              <span className="spec-label">Recommended Torque:</span>
              <span className="spec-value">{recommendedTorqueNm} Nm</span>
            </div>
          )}
          {recommendedTightness && (
            <div className="spec-item">
              <span className="spec-label">Recommended Tightness:</span>
              <span className="spec-value">{recommendedTightness}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render thread details
  const renderThreadDetails = () => {
    if (!screw.threadDetails) return null;

    const { pitch, rotation, availableSizes } = screw.threadDetails;
    
    if (!pitch && !rotation && (!availableSizes || availableSizes.length === 0)) return null;

    return (
      <div className="thread-details-section">
        <h4 className="subsection-title">Thread Details</h4>
        <div className="subsection-content">
          {renderField("Thread Pitch", pitch)}
          {renderField("Thread Rotation", rotation)}
          {renderArrayField("Available Thread Sizes", availableSizes)}
        </div>
      </div>
    );
  };

  // Helper function to check if field has non-default value
  const hasNonDefaultValue = (value, defaultValue) => {
    return value && value !== defaultValue;
  };

  // Helper function to split description into bullet points
  const renderDescription = (description) => {
    if (!description) return null;

    // Split by periods and filter out empty strings
    const sentences = description
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);

    if (sentences.length === 0) return null;

    return (
      <div className="screwdetails-section">
        <h3 className="section-title">Description</h3>
        <ul className="description-list">
          {sentences.map((sentence, index) => (
            <li key={index} className="description-item">
              {sentence}
            </li>
          ))}
        </ul>
      </div>
    );
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
              }
            >
              <Heart size={20} fill={favorited ? "currentColor" : "none"} />
            </button>
            <button
              className="modal-btn close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
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
                aria-label="Previous image"
              >
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
                aria-label="Next image"
              >
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
            <h1 className="screwdetails-name">
              {screw.name || "Unnamed Screw"}
            </h1>
            {screw.category && (
              <p className="screwdetails-category">{screw.category}</p>
            )}
          </div>

          {/* Main Specifications Grid */}
          <div className="specs-grid">
            {renderField("Material", screw.material)}
            {renderField("Driver Type", screw.driverType)}
            {hasNonDefaultValue(screw.tool, "Phillips screwdriver") && 
              renderField("Tool", screw.tool)
            }
            {renderField("Threaded Type", screw.threadedType)}
            {renderField("Strength", screw.strength)}
            {renderField("Head Type", screw.headType)}
            {renderField("Thread Pitch", screw.threadPitch)}
            {renderField("Coating", screw.coating)}
            {renderField("Drive Size", screw.driveSize)}
            {renderField("Corrosion Resistance", screw.corrosionResistance)}
            {renderArrayField("Available Sizes", screw.sizes)}
          </div>

          {/* Thread Details Section */}
          {renderThreadDetails()}

          {/* Torque Specifications Section */}
          {renderTorqueField()}

          {/* Application Section */}
          {hasNonDefaultValue(screw.application, "General fastening applications") && (
            <div className="screwdetails-section">
              <h3 className="section-title">Application</h3>
              <p className="section-content">{screw.application}</p>
            </div>
          )}

          {/* Description Section with Bullet Points */}
          {renderDescription(screw.description)}
        </div>
      </div>
    </div>
  );
};

export default ScrewPreviewModal;