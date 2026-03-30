import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, message, actions }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {actions ? (
            actions.map((action, i) => (
              <button
                key={i}
                className={`modal-btn ${action.primary ? 'modal-btn-primary' : 'modal-btn-secondary'}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button className="modal-btn modal-btn-primary" onClick={onClose}>
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;