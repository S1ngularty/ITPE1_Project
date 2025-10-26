import React from "react";
import "../../styles/user/components/confirmationModal.css";

const modalMode = {
  delete: {
    modalTitle: "Delete Confirmation",
    question: " Are you sure you want to delete",
    button: {
      left: "Cancel",
      right: "Delete",
    },
  },
  logout: {
    modalTitle: "Logout Confirmation",
    question: " Are you sure you want to end your session",
    button: {
      left: "No, not yet!",
      right: "End session",
    },
  },
};

const ConfirmationModal = ({ show, onClose, onConfirm, itemName, mode }) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <h2 className="delete-modal-title">{modalMode[mode].modalTitle}</h2>
        <p className="delete-modal-text">
          {modalMode[mode].question}
          <span className="delete-modal-item">{itemName}</span>? <br />
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {modalMode[mode].button.left}
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            {modalMode[mode].button.right}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
