import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Button,
  Paper,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../api/formService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormRenderer from '../components/FormRenderer';
import { ArrowBack, Send } from '@mui/icons-material';

const FormView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError('');
      
      const formData = await formService.getFormById(id);
      
      if (!formData) {
        setError('Formulário não encontrado');
        return;
      }
      
      // Parse do schema JSON se necessário
      let parsedForm = { ...formData };
      if (formData.schemaJson && typeof formData.schemaJson === 'string') {
        try {
          parsedForm.schema = JSON.parse(formData.schemaJson);
        } catch (parseError) {
          setError('Schema do formulário está em formato inválido');
          return;
        }
      } else if (formData.schemaJson && typeof formData.schemaJson === 'object') {
        parsedForm.schema = formData.schemaJson;
      }
      
      setForm(parsedForm);
    } catch (err) {
      console.error('Erro ao carregar formulário:', err);
      setError(err.message || 'Erro ao carregar formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await formService.submitForm(id, formData);
      
      setSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Erro ao enviar formulário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header />
        <Sidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </Box>
    );
  }

  if (error && !form) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header />
        <Sidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
          }}
        >
          <Container maxWidth="md">
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Voltar
              </Button>
            </Paper>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      
      <Box
        component="main"
        className="form-page-main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          marginLeft: '0 !important',
        }}
      >
        <Container maxWidth="md">
          {/* Cabeçalho */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Box flexGrow={1}>
              <Typography variant="h4" component="h1">
                {form?.name || 'Formulário'}
              </Typography>
              {form?.description && (
                <Typography variant="body1" color="text.secondary">
                  {form.description}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Mensagens de erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulário */}
          {form && form.schema ? (
            <Box sx={{ position: 'relative' }}>

              
              {submitting && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: 1
                  }}
                >
                  <Box textAlign="center">
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography>Enviando formulário...</Typography>
                  </Box>
                </Box>
              )}
              
              <FormRenderer
                schema={{
                  ...form.schema,
                  submitText: 'Enviar Formulário'
                }}
                onSubmit={handleSubmit}
              />
            </Box>
          ) : (
            <Box>

              
              <Alert severity="warning">
                Schema do formulário não encontrado ou inválido.
              </Alert>
            </Box>
          )}

          {/* Informações adicionais */}
          {form && (
            <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                Informações do Formulário
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  <strong>Nome:</strong> {form.name}
                </Typography>
                {form.description && (
                  <Typography variant="body2">
                    <strong>Descrição:</strong> {form.description}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Campos:</strong> {form.schema?.fields?.length || 0}
                </Typography>
                {form.createdAt && (
                  <Typography variant="body2">
                    <strong>Criado em:</strong> {new Date(form.createdAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Paper>
          )}

          {/* Snackbar de sucesso */}
          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              Formulário enviado com sucesso! Redirecionando...
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default FormView;