import React from 'react';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-3">
            <p className="text-muted mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light px-4" style={{ borderRadius: '10px' }} onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn-danger px-4" style={{ borderRadius: '10px' }} onClick={onConfirm}>Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
