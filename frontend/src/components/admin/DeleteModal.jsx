import React from "react";
import "../../styles/admin/components/Modal.css";

const DeleteUserModal = ({ isOpen, onClose, user, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-modal">
        <div className="modal-header">
          <h2>Delete User</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="warning-icon">⚠️</div>
          <h3>Are you sure you want to delete this user?</h3>
          <p>This action cannot be undone. This will permanently delete the user account and all associated data.</p>
          
          <div className="user-delete-info">
            <div className="user-avatar-large">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details-delete">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
              <div className="user-role">Role: {user?.role}</div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;