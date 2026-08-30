import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const userStr = localStorage.getItem('glowrep_user');
  let user: any = null;
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  // Derive breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const getBreadcrumbTitle = (part: string) => {
    switch (part) {
      case 'admin': return 'Gym Admin';
      case 'enquiries': return 'Enquiries CRM';
      case 'follow-ups': return 'Follow Ups';
      case 'members': return 'Members Database';
      case 'packages': return 'Membership Packages';
      case 'subscriptions': return 'Subscriptions';
      case 'workout-cards': return 'Workout Cards';
      case 'analytics': return 'Member Analytics';
      case 'feedback': return 'Feedback Management';
      case 'diet-plan': return 'Diet Plan Management';
      case 'workout-library': return 'Workout Library';
      case 'success-stories': return 'Success Stories Lab';
      case 'reports': return 'Reports';
      case 'balance-due': return 'Balance Due';
      case 'sales': return 'Sales Report';
      case 'expired': return 'Expired Members';
      case 'attendance': return 'Attendance Audit';
      case 'pt': return 'PT Report';
      case 'business': return 'Business Settings';
      case 'employees': return 'Employees';
      case 'payments': return 'Payments & Invoices';
      case 'expenses': return 'Expense Management';
      case 'settings': return 'Settings';
      case 'biometric': return 'Biometric Integration';
      case 'gym': return 'Gym Details';
      default: return part.charAt(0).toUpperCase() + part.slice(1);
    }
  };

  return (
    <div className="admin-portal-container">
      <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      
      <div className={`admin-portal-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Admin Header Bar */}
        <header className="admin-portal-header">
          <div className="admin-portal-breadcrumbs">
            <Link to="/admin" className="admin-breadcrumb-link">Gym Admin</Link>
            {pathParts.slice(1).map((part, idx) => (
              <React.Fragment key={idx}>
                <span className="admin-breadcrumb-sep">/</span>
                <span className={`admin-breadcrumb-curr ${idx === pathParts.length - 2 ? 'active' : ''}`}>
                  {getBreadcrumbTitle(part)}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="admin-portal-meta">
            <div className="admin-branch-indicator">
              <span className="admin-branch-dot" />
              <span className="admin-branch-name">Branch: Andheri West (Mumbai)</span>
            </div>
            {user && (
              <span className="admin-user-tag">
                Logged in as <strong>{user.email || 'Admin'}</strong>
              </span>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <div className="admin-portal-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
