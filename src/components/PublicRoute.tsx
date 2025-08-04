import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;