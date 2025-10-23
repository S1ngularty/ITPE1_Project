import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import "../styles/components/modal.css"
import { recordRename } from '../services/saveAnalyses';
const NamingModal = ({ isOpen, onClose, currValue, onSubmit }) => {
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (value) {
        const res = await recordRename(value,currValue.id)
        if(res) onSubmit(res)
            onClose()
    }
  };

  if (!isOpen) return null;

  // Render modal using portal - it will appear as direct child of document.body
  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h3 className="modal-title">Name Your Analysis</h3>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div onSubmit={handleSubmit}>
          <div className="modal-body">
            <label htmlFor="analysis-name" className="modal-label">
              Analysis Name
            </label>
            <input
              ref={inputRef}
              type="text"
              id="analysis-name"
              className="modal-input"
              defaultValue={currValue.name || ''}
              placeholder="Enter analysis name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="modal-btn modal-btn-submit"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NamingModal;