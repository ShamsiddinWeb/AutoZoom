// Modal.js
import React from "react";
import "./Modal.scss";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
