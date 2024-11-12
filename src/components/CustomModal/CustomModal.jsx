// CustomModal.js

import React from "react";
import "./CustomModal.scss";

const CustomModal = ({ isOpen, message, onClose, onConfirm, confirmButton }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal">
      <div className="custom-modal__content">
        <p>{message}</p>
        <div className="custom-modal__actions">
          {confirmButton && (
            <button
              onClick={() => {
                onConfirm(); 
                onClose();   
              }}
              className="confirm-button"
            >
              Confirm
            </button>
          )}
          <button
            onClick={onClose}
            className="close-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
