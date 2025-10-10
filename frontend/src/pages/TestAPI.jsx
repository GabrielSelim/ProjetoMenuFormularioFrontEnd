import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Container,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, PlayArrow, CheckCircle, Error } from '@mui/icons-material';
import { formService } from '../api/formService';
import { menuService } from '../api/menuService';
import { authService } from '../api/authService';

const TestAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, testFn) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data: result,
          message: 'Sucesso!'
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error,
          message: error.message || 'Erro desconhecido'
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'auth-login',
      title: 'Login (Auth)',
      description: 'Testa login com credenciais de teste',
      test: () => authService.login('admin@test.com', 'admin123')
    },
    {
      name: 'forms-list',
      title: 'Listar Formulários',
      description: 'GET /api/Forms',
      test: () => formService.getForms()
    },
    {
      name: 'menus-list',
      title: 'Listar Menus',
      description: 'GET /api/Menus',
      test: () => menuService.getMenus()
    },
    {
      name: 'forms-get-1',
      title: 'Buscar Formulário ID=1',
      description: 'GET /api/Forms/1',
      test: () => formService.getFormById(1)
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await testEndpoint(test.name, test.test);
      // Pequeno delay entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Teste de Conectividade API
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Esta página testa a conectividade com a API FormEngine em http://localhost:5000/api
        </Typography>
        <Box display="flex" gap={2} mb={3}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={runAllTests}
          >
            Executar Todos os Testes
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('/forms', '_blank')}
          >
            Abrir Lista de Formulários
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('/debug-form/1', '_blank')}
          >
            Testar Formulário ID=1
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('/admin/menus', '_blank')}
          >
            Gerenciar Menus
          </Button>
        </Box>
      </Box>

      {tests.map((test) => (
        <Accordion key={test.name} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Box>
                {loading[test.name] ? (
                  <CircularProgress size={20} />
                ) : results[test.name] ? (
                  results[test.name].success ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Error color="error" />
                  )
                ) : null}
              </Box>
              <Box flexGrow={1}>
                <Typography variant="h6">{test.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {test.description}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  testEndpoint(test.name, test.test);
                }}
                disabled={loading[test.name]}
              >
                Testar
              </Button>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {results[test.name] && (
              <Box>
                <Alert 
                  severity={results[test.name].success ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                >
                  {results[test.name].message}
                </Alert>
                
                {results[test.name].success ? (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Resposta da API:
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          fontSize: '0.875rem',
                          maxHeight: 300
                        }}
                      >
                        {JSON.stringify(results[test.name].data, null, 2)}
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom color="error">
                        Erro:
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: 'error.50',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          fontSize: '0.875rem',
                          maxHeight: 300,
                          color: 'error.main'
                        }}
                      >
                        {JSON.stringify(results[test.name].error, null, 2)}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={4} p={3} bgcolor="background.paper" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Informações de Configuração
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>API Base URL:</strong> http://localhost:5000/api
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Frontend URL:</strong> http://localhost:5173
        </Typography>
        <Typography variant="body2">
          <strong>Autenticação:</strong> JWT Bearer Token
        </Typography>
      </Box>

      <Box mt={4} p={3} bgcolor="success.50" borderRadius={2}>
        <Typography variant="h6" gutterBottom color="success.main">
          🎉 Melhorias Recentes Implementadas
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" paragraph>
            ✅ <strong>Formulários sem ID:</strong> Removido "(ID: X)" da exibição
          </Typography>
          <Typography component="li" variant="body2" paragraph>
            ✅ <strong>Roles visuais:</strong> Chips coloridos em vez de texto livre
          </Typography>
          <Typography component="li" variant="body2" paragraph>
            ✅ <strong>Ícones coloridos:</strong> Emojis visuais para melhor experiência
          </Typography>
          <Typography component="li" variant="body2">
            ✅ <strong>Reordenação corrigida:</strong> Drag & drop funcionando perfeitamente
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TestAPI;