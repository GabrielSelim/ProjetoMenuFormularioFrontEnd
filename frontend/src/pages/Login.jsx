import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          py: 3
        }}
      >
        <Card sx={{ 
          width: '100%', 
          maxWidth: 400, 
          boxShadow: 3,
          mx: { xs: 2, sm: 0 } // Margem lateral em mobile
        }}>
          <CardContent sx={{ 
            p: { xs: 2, sm: 3 } // Padding menor em mobile
          }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Sistema de Formulários
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faça login para acessar o sistema
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                size="medium"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                size="medium"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                sx={{ mt: 2.5, mb: 2, py: 1.2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </Box>

            <Box sx={{ mt: 3, p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 600, display: 'block' }}>
                Usuários de teste:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Admin: admin@test.com / admin123
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Usuário: user@test.com / user123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;