import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('glowrep_token');
  const userStr = localStorage.getItem('glowrep_user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    let role = 'GYM_ADMIN';
    try {
      if (userStr) {
        const user = JSON.parse(userStr);
        role = user.role || 'GYM_ADMIN';
      }
    } catch {
      role = 'GYM_ADMIN';
    }

    // MASTER_ADMIN can access all dashboards; otherwise check if role is in allowed list
    const isAllowed = role === 'MASTER_ADMIN' || allowedRoles.includes(role);
    if (!isAllowed) {
      if (role === 'NODAL_MANAGER') {
        return <Navigate to="/nodal" replace />;
      }
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

