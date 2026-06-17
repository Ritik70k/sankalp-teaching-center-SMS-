import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  text: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export default function Toast({ messages, onClose }: ToastProps) {
  return (
    <div className="toast-container">
      {messages.map((m) => (
        <ToastItem key={m.id} message={m} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastItem({ message, onClose }: { message: ToastMessage; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message.id, onClose]);

  const getIcon = () => {
    switch (message.type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'danger': return 'bi-x-circle-fill text-danger';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      default: return 'bi-info-circle-fill text-info';
    }
  };

  return (
    <div className="toast show align-items-center border-0 shadow mb-2" role="alert" style={{ borderRadius: '12px', background: 'white', minWidth: '280px' }}>
      <div className="d-flex">
        <div className="toast-body d-flex align-items-center gap-2">
          <i className={`bi ${getIcon()} fs-18`}></i>
          <span className="fw-600 text-dark fs-13">{message.text}</span>
        </div>
        <button type="button" className="btn-close me-2 m-auto" onClick={() => onClose(message.id)}></button>
      </div>
    </div>
  );
}
