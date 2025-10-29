import React from "react";
import { useState, useEffect } from "react";
import "../../styles/user/components/SavedScrewsModal.css";
import axios from "axios";
import { getToken } from "../../utils/authUtil";

const SavedScrewsModal = ({ isOpen, onClose }) => {
  const [localSavedScrews, setLocalSavedScrews] = useState([]);

  async function fetchSavedScrews() {
    await axios
      .get(`${import.meta.env.VITE_APP_API}api/v1/likes`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setLocalSavedScrews(response.data.result[0]?.savedScrews || []);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    fetchSavedScrews();
  }, []);

  // useEffect(()=>{
  // },[localSavedScrews])

  if (!isOpen) return null;

  const handleUnlike = async (screwId) => {
    await axios
      .post(
        `${import.meta.env.VITE_APP_API}api/v1/likes/remove`,
        { screwId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setLocalSavedScrews((prev) =>
          prev.filter((screw) => screw.screwId._id !== screwId)
        );
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="saved-screws-modal-overlay">
      <div className="saved-screws-modal-container">
        {/* Modal Header */}
        <div className="saved-screws-modal-header">
          <h2>Saved Screws ({localSavedScrews.length})</h2>
          <button className="saved-screws-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="saved-screws-modal-content">
          {localSavedScrews && localSavedScrews.length > 0 ? (
            <div className="saved-screws-grid">
              {localSavedScrews.map((screw) => (
                <div key={screw.screwId._id} className="screw-card">
                  {/* Screw Header with Like Button */}
                  <div className="screw-card-header">
                    <h3 className="screw-name">{screw.screwId.name}</h3>
                    <button
                      className="like-button liked"
                      onClick={() => handleUnlike(screw.screwId._id)}
                      title="Remove from saved">
                      ♡
                    </button>
                  </div>

                  {/* Screw Image */}
                  <div className="screw-image-container">
                    {screw.screwId.images && screw.screwId.images.length > 0 ? (
                      <img
                        src={screw.screwId.images[0].url}
                        alt={screw.screwId.name}
                        className="screw-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="screw-image-placeholder">🔩</div>
                  </div>

                  {/* Screw Details */}
                  <div className="screw-details">
                    <div className="screw-category">
                      <span className="category-badge">
                        {screw.screwId.category}
                      </span>
                    </div>

                    {/* Specifications */}
                    <div className="screw-specs">
                      <div className="spec-item">
                        <span className="spec-label">Material:</span>
                        <span className="spec-value">
                          {screw.screwId.material}
                        </span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Driver Type:</span>
                        <span className="spec-value">
                          {screw.screwId.driverType}
                        </span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Thread Type:</span>
                        <span className="spec-value">
                          {screw.screwId.threadedType}
                        </span>
                      </div>
                    </div>

                    {/* Available Sizes */}
                    {screw.screwId.sizes && screw.screwId.sizes.length > 0 && (
                      <div className="screw-sizes">
                        <span className="sizes-label">Available Sizes:</span>
                        <div className="size-tags">
                          {screw.screwId.sizes.map((size, index) => (
                            <span key={index} className="size-tag">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strength */}
                    {screw.screwId.strength && (
                      <div className="screw-strength">
                        <span className="strength-label">Strength:</span>
                        <p className="strength-value">
                          {screw.screwId.strength}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {screw.screwId.description && (
                      <div className="screw-description">
                        <p>{screw.screwId.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-saved-screws">
              <div className="empty-icon">🔩</div>
              <h3>No Saved Screws</h3>
              <p>You haven't saved any screws yet.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="saved-screws-modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedScrewsModal;
