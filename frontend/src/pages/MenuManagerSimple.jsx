import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MenuManagerSimple = () => {
  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: '260px',
          marginTop: '64px',
        }}
      >
        <Typography variant="h3" gutterBottom>
          🎯 Gerenciar Menus - VERSÃO SIMPLES
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esta é uma versão simplificada da página de gerenciamento de menus.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Se você está vendo esta página, o roteamento está funcionando!
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Teste de Botão
        </Button>
      </Box>
    </Box>
  );
};

export default MenuManagerSimple;