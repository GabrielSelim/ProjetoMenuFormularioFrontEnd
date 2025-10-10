import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Container,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Description
} from '@mui/icons-material';
import { formService } from '../api/formService';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormRenderer from '../components/FormRenderer';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewForm, setPreviewForm] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    // Filtrar formulários baseado no termo de busca
    if (searchTerm.trim() === '') {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredForms(filtered);
    }
  }, [searchTerm, forms]);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError('');
      const formsData = await formService.getForms();
      setForms(formsData || []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar formulários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
      try {
        await formService.deleteForm(formId);
        await loadForms(); // Recarrega a lista
      } catch (err) {
        setError(err.message || 'Erro ao excluir formulário');
      }
    }
  };

  const handlePreview = async (form) => {
    try {
      const formData = await formService.getFormById(form.id);
      setPreviewForm(formData);
      setPreviewOpen(true);
    } catch (err) {
      setError(err.message || 'Erro ao carregar formulário para preview');
    }
  };

  const handleEdit = (formId) => {
    navigate(`/admin/forms/builder/${formId}`);
  };

  const handleView = (formId) => {
    navigate(`/forms/${formId}`);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  const getStatusLabel = (isActive) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

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
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Lista de Formulários
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/forms/builder')}
            >
              Criar Formulário
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Barra de Pesquisa */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar formulários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography>Carregando formulários...</Typography>
            </Box>
          ) : filteredForms.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Nenhum formulário encontrado' : 'Nenhum formulário criado ainda'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm 
                  ? 'Tente usar termos diferentes na pesquisa'
                  : 'Comece criando seu primeiro formulário'
                }
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/admin/forms/builder')}
                >
                  Criar Primeiro Formulário
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredForms.map((form) => (
                <Grid item xs={12} sm={6} md={4} key={form.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {form.name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(form.isActive)}
                          color={getStatusColor(form.isActive)}
                          size="small"
                        />
                      </Box>
                      
                      {form.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {form.description}
                        </Typography>
                      )}
                      
                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip
                          label={`${form.schema?.fields?.length || 0} campos`}
                          size="small"
                          variant="outlined"
                        />
                        {form.createdAt && (
                          <Chip
                            label={new Date(form.createdAt).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      {form.schema?.title && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Título:</strong> {form.schema.title}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleView(form.id)}
                      >
                        Visualizar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(form.id)}
                      >
                        Editar
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(form)}
                        color="primary"
                      >
                        <Search />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(form.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Estatísticas */}
          {forms.length > 0 && (
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {forms.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Formulários
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {forms.filter(f => f.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Formulários Ativos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="text.secondary">
                      {forms.reduce((total, form) => total + (form.schema?.fields?.length || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Campos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Dialog de Preview */}
          <Dialog 
            open={previewOpen} 
            onClose={() => setPreviewOpen(false)} 
            maxWidth="md" 
            fullWidth
          >
            <DialogTitle>
              Preview: {previewForm?.name}
            </DialogTitle>
            <DialogContent>
              {previewForm?.schema ? (
                <FormRenderer schema={previewForm.schema} readOnly />
              ) : (
                <Alert severity="warning">
                  Schema do formulário não encontrado
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>
                Fechar
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  setPreviewOpen(false);
                  handleView(previewForm.id);
                }}
              >
                Abrir Formulário
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default FormList;