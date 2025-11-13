import React, { useState } from "react";
import "../../styles/user/pages/FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose, analysisId, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    type: "general_feedback"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  console.log(analysisId)
  if (!isOpen || !analysisId) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters long";
    } else if (formData.comment.length > 1000) {
      newErrors.comment = "Comment must be less than 1000 characters";
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a valid rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        analysis: analysisId
      });
      // Reset form on successful submission
      setFormData({
        rating: 5,
        comment: "",
        type: "general_feedback"
      });
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrors({ submit: "Failed to submit feedback. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const feedbackTypes = [
    { value: "general_feedback", label: "General Feedback" },
    { value: "bug", label: "Bug Report" },
    { value: "feature_request", label: "Feature Request" },
    { value: "accuracy_issue", label: "Accuracy Issue" }
  ];

  return (
    <div className="feedback-modal-overlay" onClick={handleOverlayClick}>
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h2>Submit Feedback</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Rating Section */}
          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating *
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${formData.rating >= star ? "active" : ""}`}
                  onClick={() => handleChange({
                    target: { name: "rating", value: star }
                  })}
                  disabled={loading}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.rating && (
              <span className="error-message">{errors.rating}</span>
            )}
          </div>

          {/* Feedback Type */}
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Feedback Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              {feedbackTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comment Section */}
          <div className="form-group">
            <label htmlFor="comment" className="form-label">
              Comment *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Please share your feedback, suggestions, or report any issues you encountered..."
              className={`form-textarea ${errors.comment ? "error" : ""}`}
              rows={5}
              maxLength={1000}
              disabled={loading}
            />
            <div className="textarea-meta">
              <span className="char-count">
                {formData.comment.length}/1000
              </span>
            </div>
            {errors.comment && (
              <span className="error-message">{errors.comment}</span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;