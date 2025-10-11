import React, { useState, useEffect } from 'react';
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
  Stack,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description,
  People,
  Assessment,
  TrendingUp,
  Assignment,
  Menu as MenuIcon,
  Timeline,
  Analytics,
  Speed,
  Stars,
  Notifications,
  Launch,
  AccessTime,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { formService } from '../api/formService';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { menus } = useMenu();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalForms: 0,
    activeForms: 0,
    totalMenus: 0,
    recentActivity: [],
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, [menus]);

  const loadDashboardData = async () => {
    try {
      let forms = [];
      try {
        forms = await formService.getForms();
      } catch (err) {
        console.warn('Não foi possível carregar formulários:', err);
      }

      setDashboardData({
        totalForms: forms.length,
        activeForms: forms.filter(f => f.isActive !== false).length,
        totalMenus: menus.length,
        formMenus: menus.filter(m => m.contentType === 'form').length,
        recentActivity: generateRecentActivity(forms, menus),
        loading: false
      });
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const generateRecentActivity = (forms, menus) => {
    const activities = [];
    
    // Adiciona atividades dos formulários
    forms.slice(0, 3).forEach(form => {
      activities.push({
        id: `form-${form.id}`,
        type: 'form',
        title: `Formulário "${form.name}" criado`,
        time: form.createdAt || new Date().toISOString(),
        icon: '📝',
        color: 'primary'
      });
    });

    // Adiciona atividades dos menus
    menus.slice(0, 2).forEach(menu => {
      activities.push({
        id: `menu-${menu.id}`,
        type: 'menu',
        title: `Menu "${menu.name}" configurado`,
        time: new Date().toISOString(),
        icon: '📋',
        color: 'secondary'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const stats = [
    {
      title: 'Total de Formulários',
      value: dashboardData.totalForms,
      change: '+12%',
      changeType: 'positive',
      icon: <Description sx={{ fontSize: 40 }} />,
      color: 'primary',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/forms')
    },
    {
      title: 'Formulários Ativos',
      value: dashboardData.activeForms,
      change: '+8%',
      changeType: 'positive',
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: 'success',
      bgGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      onClick: () => navigate('/forms')
    },
    {
      title: 'Menus Configurados',
      value: dashboardData.totalMenus,
      change: '+3',
      changeType: 'neutral',
      icon: <MenuIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/admin/menus')
    },
    {
      title: 'Menus de Formulário',
      value: dashboardData.formMenus,
      change: 'novo',
      changeType: 'positive',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: 'warning',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => navigate('/admin/menus')
    }
  ];

  const quickActions = [
    {
      title: 'Visualizar Formulários',
      description: 'Acessar todos os formulários disponíveis',
      action: () => navigate('/forms'),
      icon: '📋',
      show: true,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Construtor de Formulários',
      description: 'Criar novos formulários personalizados',
      action: () => navigate('/admin/forms/builder'),
      icon: '🔧',
      show: hasRole(['admin', 'manager']),
      color: 'success',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      title: 'Gerenciar Menus',
      description: 'Configurar navegação e menus do sistema',
      action: () => navigate('/admin/menus'),
      icon: '⚙️',
      show: hasRole(['admin', 'manager']),
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Teste da API',
      description: 'Verificar conectividade e funcionalidades',
      action: () => navigate('/test-api'),
      icon: '🔍',
      show: hasRole(['admin']),
      color: 'info',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Bom dia';
    if (hour < 18) return '☀️ Boa tarde';
    return '🌙 Boa noite';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  if (dashboardData.loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 140px)', margin: -3, p: 3 }}>
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            />
            
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ width: 22, height: 22, bgcolor: 'success.main' }}>
                    <CheckCircle sx={{ fontSize: 16 }} />
                  </Avatar>
                }
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 60, md: 80 }, 
                    height: { xs: 60, md: 80 }, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontSize: { xs: 24, md: 32 }
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <People />}
                </Avatar>
              </Badge>
              
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant={{ xs: 'h4', md: 'h3' }} gutterBottom sx={{ fontWeight: 300 }}>
                  {getGreeting()}, {user?.name || user?.email?.split('@')[0]}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, mb: 2 }}>
                  Bem-vindo ao Sistema de Formulários Sanz Tech
                </Typography>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Chip 
                    icon={<Stars />}
                    label={user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Chip 
                    icon={<AccessTime />}
                    label={new Date().toLocaleDateString('pt-BR')}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Stack>
              </Box>


            </Stack>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card 
                  onClick={stat.onClick}
                  sx={{ 
                    height: '100%',
                    background: stat.bgGradient,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {/* Background decoration */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -30,
                      right: -30,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }}
                  />
                  
                  <CardContent sx={{ p: 3, position: 'relative' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 2, 
                        p: 1.5,
                        backdropFilter: 'blur(10px)'
                      }}>
                        {stat.icon}
                      </Box>
                      <IconButton size="small" sx={{ color: 'white' }}>
                        <Launch />
                      </IconButton>
                    </Stack>
                    
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                      {stat.title}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.change}
                      </Typography>
                      {stat.changeType === 'positive' && <TrendingUp sx={{ fontSize: 16 }} />}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Quick Actions */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    ⚡ Ações Rápidas
                  </Typography>
                  <Chip label="Ativo" color="success" size="small" />
                </Stack>
                
                <Grid container spacing={3}>
                  {quickActions
                    .filter(action => action.show)
                    .map((action, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card 
                          onClick={action.action}
                          sx={{ 
                            p: 3,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '2px solid transparent',
                            borderRadius: 3,
                            background: 'linear-gradient(white, white) padding-box, ' + action.gradient + ' border-box',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                              borderColor: action.color + '.main'
                            }
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Box sx={{ 
                              fontSize: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              background: action.gradient
                            }}>
                              {action.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {action.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {action.description}
                              </Typography>
                            </Box>
                            <Launch color="action" />
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🕒 Atividade Recente
                </Typography>
                
                <Stack spacing={2}>
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <Box key={activity.id} sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ fontSize: 20 }}>
                            {activity.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(activity.time)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma atividade recente
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* System Status */}
          <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              📊 Status do Sistema
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disponibilidade
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={99.9} 
                    color="success" 
                    sx={{ mt: 1, height: 6, borderRadius: 3 }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    <Speed /> Fast
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={95} 
                    color="primary" 
                    sx={{ mt: 1, height: 6, borderRadius: 3 }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    v2.1.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Versão Atual
                  </Typography>
                  <Chip label="Atualizado" color="info" size="small" sx={{ mt: 1 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Dashboard;