// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('[ProtectedRoute] Checking authentication status:', { 
    isAuthenticated, 
    loading,
    redirectPath 
  });

  if (loading) {
    console.log('[ProtectedRoute] Loading auth status...');
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('[ProtectedRoute] User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;