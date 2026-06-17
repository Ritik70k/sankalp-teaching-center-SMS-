import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface SidebarProps {
  show: boolean;
  onToggle: () => void;
}

export default function Sidebar({ show, onToggle }: SidebarProps) {
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.students.list('?limit=1')
      .then(res => setActiveCount(res.activeCount || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stc_token');
    localStorage.removeItem('stc_user');
    navigate('/login');
  };

  return (
    <div id="sidebar" className={show ? 'show' : ''}>
      <NavLink to="/" className="sidebar-brand">
        <div className="brand-icon"><i className="bi bi-mortarboard-fill"></i></div>
        <div>
          <div className="brand-text">Sankalp</div>
          <div className="brand-sub">Teaching Center</div>
        </div>
      </NavLink>

      <div className="sidebar-nav">
        <div className="nav-section-label">Core Modules</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-grid-fill nav-icon"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people-fill nav-icon"></i>
          <span>Students</span>
          {activeCount > 0 && <span className="nav-badge">{activeCount}</span>}
        </NavLink>
        <NavLink to="/teachers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person-workspace nav-icon"></i>
          <span>Teachers</span>
        </NavLink>
        <NavLink to="/batches" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-collection-fill nav-icon"></i>
          <span>Batches</span>
        </NavLink>

        <div className="nav-section-label">Operations</div>
        <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-calendar-check-fill nav-icon"></i>
          <span>Attendance</span>
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-cash-coin nav-icon"></i>
          <span>Payments</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-graph-up-arrow nav-icon"></i>
          <span>Reports</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-gear-fill nav-icon"></i>
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="admin-info mb-2">
          <div className="admin-avatar">A</div>
          <div>
            <div className="admin-name">Admin User</div>
            <div className="admin-role">Institution Head</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 border-0 text-start ps-3" style={{ borderRadius: '10px' }}>
          <i className="bi bi-box-arrow-left me-2"></i>Sign Out
        </button>
      </div>
    </div>
  );
}
