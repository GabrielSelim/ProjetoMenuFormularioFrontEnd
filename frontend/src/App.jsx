import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Providers
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuManager from './pages/MenuManager';
import MenuManagerSimple from './pages/MenuManagerSimple';
import TestPage from './pages/TestPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormList from './pages/FormList';
import FormView from './pages/FormView';

// Styles
import './styles/global.css';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Tema do Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      dark: '#1976D2',
      light: '#BBDEFB',
    },
    secondary: {
      main: '#FF5722',
      dark: '#D84315',
      light: '#FFCCBC',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
});

// Página de não autorizado
const UnauthorizedPage = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <h1>Acesso Negado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
    <button onClick={() => window.history.back()}>
      Voltar
    </button>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <MenuProvider>
            <BrowserRouter>
              <Routes>
                {/* Rota pública - Login */}
                <Route path="/login" element={<Login />} />
                
                {/* Página de não autorizado */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Rotas protegidas */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rotas de teste */}
                <Route 
                  path="/test" 
                  element={<TestPage />} 
                />
                
                {/* Rotas de administração */}
                <Route 
                  path="/admin/menus" 
                  element={<MenuManager />} 
                />
                
                <Route 
                  path="/admin/menus-simple" 
                  element={<MenuManagerSimple />} 
                />
                
                <Route 
                  path="/admin/menus-protected" 
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <MenuManager />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/forms/builder" 
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <FormBuilderPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/forms/builder/:id" 
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <FormBuilderPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/forms" 
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <FormList />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rotas de formulários */}
                <Route 
                  path="/forms" 
                  element={
                    <ProtectedRoute>
                      <FormList />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/forms/:id" 
                  element={
                    <ProtectedRoute>
                      <FormView />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rota padrão - redireciona para dashboard se autenticado, senão para login */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Navigate to="/dashboard" replace />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rota catch-all - redireciona para login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;