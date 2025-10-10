import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o usuário tem o role necessário
  if (roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;