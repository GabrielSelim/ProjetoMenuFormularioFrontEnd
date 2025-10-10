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

  // Função para contar campos (suporta FormEngine e formulários tradicionais)
  const getFormFieldsCount = (form) => {
    // FormEngine.io - contar children recursivamente
    if (form.schema?.formEngineSchema?.form?.children) {
      const countChildren = (children) => {
        if (!Array.isArray(children)) return 0;
        return children.reduce((count, child) => {
          // Contar o próprio elemento se for um campo
          let currentCount = (child.type && child.type !== 'Screen') ? 1 : 0;
          // Contar filhos recursivamente
          if (child.children) {
            currentCount += countChildren(child.children);
          }
          return count + currentCount;
        }, 0);
      };
      return countChildren(form.schema.formEngineSchema.form.children);
    }
    
    // Formulários tradicionais
    return form.schema?.fields?.length || 0;
  };

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
      console.log('Carregando lista de formulários...');
      const formsData = await formService.getForms();
      console.log('Formulários recebidos:', formsData);
      
      // Processa os formulários para incluir schema parseado
      const processedForms = (formsData || []).map(form => {
        let processedForm = { ...form };
        if (form.schemaJson && typeof form.schemaJson === 'string') {
          try {
            processedForm.schema = JSON.parse(form.schemaJson);
          } catch (parseError) {
            console.warn('Erro ao parsear schema do formulário', form.id, parseError);
            processedForm.schema = null;
          }
        } else if (form.schemaJson && typeof form.schemaJson === 'object') {
          processedForm.schema = form.schemaJson;
        }
        return processedForm;
      });
      
      setForms(processedForms);
    } catch (err) {
      console.error('Erro ao carregar formulários:', err);
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
      console.log('Carregando preview do formulário:', form.id);
      const formData = await formService.getFormById(form.id);
      console.log('Dados do formulário para preview:', formData);
      
      // Parse do schema se necessário
      let processedForm = { ...formData };
      if (formData.schemaJson && typeof formData.schemaJson === 'string') {
        try {
          processedForm.schema = JSON.parse(formData.schemaJson);
          console.log('Schema parseado para preview:', processedForm.schema);
        } catch (parseError) {
          console.error('Erro ao parsear schema para preview:', parseError);
          processedForm.schema = null;
        }
      } else if (formData.schemaJson && typeof formData.schemaJson === 'object') {
        processedForm.schema = formData.schemaJson;
      }
      
      setPreviewForm(processedForm);
      setPreviewOpen(true);
    } catch (err) {
      console.error('Erro ao carregar formulário para preview:', err);
      setError(err.message || 'Erro ao carregar formulário para preview');
    }
  };

  const handleEdit = (formId) => {
    console.log('🔧 Editando formulário ID:', formId);
    navigate(`/admin/forms/builder-advanced/${formId}`);
  };

  const handleView = (formId) => {
    console.log('🔍 Clicou em Visualizar formulário ID:', formId);
    console.log('🚀 Navegando para:', `/forms/${formId}`);
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
        className="form-page-main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          marginLeft: '0 !important',
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Lista de Formulários
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/forms/builder-advanced')}
              >
                Construtor de Formulários
              </Button>
            </Box>
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
                <Box display="flex" gap={2} justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/admin/forms/builder-advanced')}
                  >
                    Construtor de Formulários
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredForms.map((form) => (
                <Grid item xs={12} sm={6} md={4} key={form.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {form.name}
                      </Typography>
                      
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
                          label={`${getFormFieldsCount(form)} campos`}
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
                      {forms.reduce((total, form) => total + getFormFieldsCount(form), 0)}
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