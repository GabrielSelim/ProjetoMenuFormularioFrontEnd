import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import {
  Block as BlockIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <BlockIcon 
            sx={{ 
              fontSize: 80, 
              color: 'error.main',
              mb: 2
            }} 
          />
        </Box>
        
        <Typography variant="h4" gutterBottom color="error.main" fontWeight="bold">
          Acesso Negado
        </Typography>
        
        <Typography variant="h6" gutterBottom color="text.secondary">
          Você não tem permissão para acessar esta página
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Seu perfil atual: <strong>{user?.role || 'Não definido'}</strong>
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
          Esta área é restrita para administradores e gerentes.
          Entre em contato com o administrador do sistema se precisar de acesso.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Voltar ao Dashboard
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
            size="large"
          >
            Página Anterior
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccessDenied;