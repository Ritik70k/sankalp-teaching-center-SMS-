import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface TopnavProps {
  onToggleSidebar: () => void;
}

export default function Topnav({ onToggleSidebar }: TopnavProps) {
  const username = localStorage.getItem('stc_user') || 'Admin';

  return (
    <div id="topnav">
      <button id="sidebar-toggle" onClick={onToggleSidebar}>
        <i className="bi bi-list"></i>
      </button>
      <div className="page-title-nav d-none d-md-block">Sankalp Portal</div>

      <div className="topnav-actions">
        <Link to="/settings" className="topnav-btn">
          <i className="bi bi-bell"></i>
        </Link>
        <Link to="/settings" className="topnav-btn">
          <i className="bi bi-gear"></i>
        </Link>
        <div className="topnav-divider"></div>
        <div className="user-pill">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <span className="name d-none d-sm-inline">{username}</span>
        </div>
      </div>
    </div>
  );
}
