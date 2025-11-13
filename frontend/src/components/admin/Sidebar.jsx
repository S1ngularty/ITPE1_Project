import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/admin/components/Sidebar.css";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard"
    },
    {
      id: "feedbacks",
      label: "Review Feedbacks",
      icon: "💬",
      path: "/admin/feedbacks"
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <div className="brand-logo">🔧</div>
            <div className="brand-text">
              <h3>ScrewDetect</h3>
              <span className="brand-subtitle">Admin Panel</span>
            </div>
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <div
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        )}
        <div className="sidebar-actions">
          <button 
            className="sidebar-action-btn"
            onClick={() => navigate('/')}
            title="Back to Main Site"
          >
            🏠 {!isCollapsed && <span>Main Site</span>}
          </button>
          <button 
            className="sidebar-action-btn logout-btn"
            onClick={() => {
              // Handle logout
              console.log('Logout clicked');
            }}
            title="Logout"
          >
            🚪 {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;