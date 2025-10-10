import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Avatar,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description,
  People,
  Assessment,
  TrendingUp,
  Assignment,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { menus } = useMenu();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Formulários',
      value: menus.filter(m => m.type === 'form').length,
      icon: <Description />,
      color: 'primary.main'
    },
    {
      title: 'Menus Ativos',
      value: menus.length,
      icon: <MenuIcon />,
      color: 'secondary.main'
    },
    {
      title: 'Acesso',
      value: '24/7',
      icon: <TrendingUp />,
      color: 'success.main'
    }
  ];

  const quickActions = [
    {
      title: 'Formulários',
      description: 'Visualizar formulários disponíveis',
      action: () => navigate('/forms'),
      icon: <Assignment />,
      show: true,
      color: 'primary'
    },
    {
      title: 'Gerenciar Menus',
      description: 'Configurar menus do sistema',
      action: () => navigate('/admin/menus'),
      icon: <MenuIcon />,
      show: hasRole('admin'),
      color: 'secondary'
    },
    {
      title: 'Criar Formulário',
      description: 'Construtor de formulários',
      action: () => navigate('/admin/forms/builder'),
      icon: <Description />,
      show: hasRole('admin'),
      color: 'info'
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { xs: 0, sm: '260px' },
          marginTop: '64px',
          bgcolor: 'grey.50',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <People />}
              </Avatar>
              <Box>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 300 }}>
                  Olá, {user?.name || user?.email?.split('@')[0]}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                  Bem-vindo ao Sistema de Formulários
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    background: 'white',
                    border: '1px solid',
                    borderColor: 'grey.100',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
            Ações Rápidas
          </Typography>
          <Grid container spacing={3}>
            {quickActions
              .filter(action => action.show)
              .map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: `${action.color}.main` }}>
                          {action.icon}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {action.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        variant="contained"
                        color={action.color}
                        onClick={action.action}
                        sx={{ borderRadius: 2 }}
                      >
                        Acessar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {/* Recent Menus */}
          {menus.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
                Menus Recentes
              </Typography>
              <Grid container spacing={2}>
                {menus.slice(0, 6).map((menu) => (
                  <Grid item xs={12} sm={6} md={4} key={menu.id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }} gutterBottom>
                        {menu.title}
                      </Typography>
                      <Chip 
                        label={menu.type} 
                        size="small" 
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;