
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} replace />;
  }

  return <Login />;
};

export default Index;
