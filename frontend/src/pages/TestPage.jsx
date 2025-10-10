import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TestComponents from '../components/TestComponents';

const TestPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        🎉 Teste da Rota - FUNCIONANDO!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Se você está vendo esta página, a rota está funcionando corretamente.
      </Typography>
      
      <TestComponents />
      
      <Button variant="contained" onClick={() => window.history.back()}>
        Voltar
      </Button>
    </Box>
  );
};

export default TestPage;