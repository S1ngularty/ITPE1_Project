import React, { useState, useEffect } from "react";
import "../../styles/admin/pages/FeedbackManagement.css";
import AdminSidebar from "../../components/admin/Sidebar";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(
        `${import.meta.env.VITE_APP_API}api/v1/review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setFeedbacks(data.result || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${rating >= star ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      general_feedback: { label: "General", color: "blue" },
      bug: { label: "Bug", color: "red" },
      feature_request: { label: "Feature", color: "purple" },
      accuracy_issue: { label: "Accuracy", color: "orange" },
    };
    const config = typeConfig[type] || { label: type, color: "gray" };
    return (
      <span className={`type-badge type-${config.color}`}>{config.label}</span>
    );
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading feedbacks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar></AdminSidebar>
      <div className="admin-main-content">
        <div className="feedback-management-page">
          {/* Header */}
          <div className="admin-header">
            <div className="header-left">
              <h1>User Feedbacks</h1>
              <p>View and manage user feedback and suggestions</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary" onClick={fetchFeedbacks}>
                Refresh
              </button>
            </div>
          </div>

          {/* Feedback List */}
          <div className="feedbacks-container">
            {feedbacks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>No feedbacks yet</h3>
                <p>User feedbacks will appear here once submitted.</p>
              </div>
            ) : (
              <div className="feedbacks-grid">
                {feedbacks.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <div className="feedback-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {feedback.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {feedback.user?.name || "Unknown User"}
                          </div>
                          <div className="user-email">
                            {feedback.user?.email}
                          </div>
                          <div className="feedback-date">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="feedback-meta">
                        {renderStars(feedback.rating)}
                        {getTypeBadge(feedback.type)}
                      </div>
                    </div>

                    <div className="feedback-content">
                      <p className="feedback-comment">{feedback.comment}</p>

                      <div className="analysis-info">
                        <div className="analysis-label">Analysis Details:</div>
                        <div className="analysis-name">
                          {feedback.analysis?.name}
                        </div>
                        <div className="analysis-service">
                          Service:{" "}
                          {feedback.analysis?.typeOfService || "Unknown"}
                        </div>
                        <div className="analysis-count">
                          Screws Counted: {feedback.analysis?.count || 0}
                        </div>
                      </div>
                    </div>

                    <div className="feedback-stats">
                      <div className="stat-item">
                        <span className="stat-label">Helpful:</span>
                        <span className="stat-value">
                          {feedback.helpfulCount}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Reports:</span>
                        <span className="stat-value">
                          {feedback.reportCount}
                        </span>
                      </div>
                    </div>

                    <div className="feedback-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setShowDetailModal(true);
                        }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Detail Modal - Landscape Layout */}
      {showDetailModal && selectedFeedback && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}>
          <div
            className="modal-content landscape-modal"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Feedback Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body landscape-body">
              {/* Left Side - Image */}
              <div className="image-section">
                <div className="image-container">
                  <img
                    src={selectedFeedback.analysis?.uploadedImage?.url}
                    alt="Analysis result"
                    className="analysis-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="image-placeholder">
                    <div className="placeholder-icon">📷</div>
                    <p>No image available</p>
                  </div>
                </div>
                <div className="image-info">
                  <h4>Analysis Image</h4>
                  <p className="image-meta">
                    {selectedFeedback.analysis?.name || "Unnamed Analysis"}
                  </p>
                </div>
              </div>

              {/* Right Side - Information */}
              <div className="info-section">
                <div className="info-content">
                  {/* User Information */}
                  <div className="detail-section">
                    <h3>User Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Name:</strong>
                        <span>{selectedFeedback.user?.name || "Unknown"}</span>
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong>
                        <span>
                          {selectedFeedback.user?.email || "Not provided"}
                        </span>
                      </div>
                      <div className="info-item">
                        <strong>Role:</strong>
                        <span>{selectedFeedback.user?.role || "user"}</span>
                      </div>
                      <div className="info-item">
                        <strong>Submitted:</strong>
                        <span>
                          {new Date(
                            selectedFeedback.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Information */}
                  <div className="detail-section">
                    <h3>Feedback Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Rating:</strong>
                        <span>{renderStars(selectedFeedback.rating)}</span>
                      </div>
                      <div className="info-item">
                        <strong>Type:</strong>
                        <span>{getTypeBadge(selectedFeedback.type)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="detail-section">
                    <h3>Analysis Details</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Analysis Name:</strong>
                        <span>{selectedFeedback.analysis?.name}</span>
                      </div>
                      <div className="info-item">
                        <strong>Service Type:</strong>
                        <span>{selectedFeedback.analysis?.typeOfService}</span>
                      </div>
                      <div className="info-item">
                        <strong>Screws Counted:</strong>
                        <span>{selectedFeedback.analysis?.count}</span>
                      </div>
                      <div className="info-item">
                        <strong>Analysis Date:</strong>
                        <span>
                          {new Date(
                            selectedFeedback.analysis?.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Comment */}
                  <div className="detail-section">
                    <h3>User Comment</h3>
                    <div className="comment-box">
                      {selectedFeedback.comment}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
