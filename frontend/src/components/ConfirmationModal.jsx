import React from "react";
import "../styles/components/confirmationModal.css"

const ConfirmationModal = ({ show, onClose, onConfirm, itemName }) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <h2 className="delete-modal-title">Delete Confirmation</h2>
        <p className="delete-modal-text">
          Are you sure you want to delete{" "}
          <span className="delete-modal-item">{itemName}</span>? <br />
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
