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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Description,
  History
} from '@mui/icons-material';
import { formService } from '../api/formService';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FormRenderer from '../components/FormRenderer';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewForm, setPreviewForm] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState({});
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
      const formsData = await formService.getForms();
      
      const processedForms = (formsData || []).map(form => {
        let processedForm = { ...form };
        if (form.schemaJson && typeof form.schemaJson === 'string') {
          try {
            processedForm.schema = JSON.parse(form.schemaJson);
          } catch (parseError) {
            processedForm.schema = null;
          }
        } else if (form.schemaJson && typeof form.schemaJson === 'object') {
          processedForm.schema = form.schemaJson;
        }
        return processedForm;
      });
      
      const groupedForms = groupFormsByName(processedForms);
      setForms(groupedForms);
      
      const initialVersions = {};
      groupedForms.forEach(formGroup => {
        const groupKey = `${formGroup.name}_${formGroup.originalFormId}`;
        initialVersions[groupKey] = formGroup.latestVersion;
      });
      setSelectedVersions(initialVersions);
      
    } catch (err) {
      setError(err.message || 'Erro ao carregar formulários');
    } finally {
      setLoading(false);
    }
  };

  const groupFormsByName = (forms) => {
    const grouped = {};
    
    forms.forEach(form => {
      const originalId = form.originalFormId || form.id;
      const groupKey = `${form.name}_${originalId}`;
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          name: form.name,
          originalFormId: originalId,
          versions: [],
          latestVersion: form.version || '1.0',
          id: form.id
        };
      }
      grouped[groupKey].versions.push(form);
      
      if (form.isLatest) {
        grouped[groupKey].latestVersion = form.version || '1.0';
        grouped[groupKey].id = form.id;
      }
    });
    
    return Object.values(grouped).map(group => ({
      ...group,
      versions: group.versions.sort((a, b) => {
        const versionA = parseFloat((a.version || '1.0').replace('v', ''));
        const versionB = parseFloat((b.version || '1.0').replace('v', ''));
        return versionA - versionB;
      })
    }));
  };

  const getSelectedForm = (formGroup) => {
    const groupKey = `${formGroup.name}_${formGroup.originalFormId}`;
    const selectedVersion = selectedVersions[groupKey] || formGroup.latestVersion;
    return formGroup.versions.find(v => v.version === selectedVersion) || formGroup.versions[formGroup.versions.length - 1];
  };

  const handleVersionChange = (formGroup, version) => {
    const groupKey = `${formGroup.name}_${formGroup.originalFormId}`;
    setSelectedVersions(prev => ({
      ...prev,
      [groupKey]: version
    }));
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
      
      // Parse do schema se necessário
      let processedForm = { ...formData };
      if (formData.schemaJson && typeof formData.schemaJson === 'string') {
        try {
          processedForm.schema = JSON.parse(formData.schemaJson);
        } catch (parseError) {
          processedForm.schema = null;
        }
      } else if (formData.schemaJson && typeof formData.schemaJson === 'object') {
        processedForm.schema = formData.schemaJson;
      }
      
      setPreviewForm(processedForm);
      setPreviewOpen(true);
    } catch (err) {
      setError(err.message || 'Erro ao carregar formulário para preview');
    }
  };

  const handleEdit = (formId) => {
    navigate(`/admin/forms/builder-advanced/${formId}`);
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
    <Layout>
      <Container maxWidth="xl">
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
              {filteredForms.map((formGroup) => {
                const selectedForm = getSelectedForm(formGroup);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={formGroup.name}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                            {formGroup.name}
                          </Typography>
                          <Chip
                            icon={<History />}
                            label={`${formGroup.versions.length} versões`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>

                        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Versão</InputLabel>
                          <Select
                            value={selectedVersions[`${formGroup.name}_${formGroup.originalFormId}`] || formGroup.latestVersion}
                            label="Versão"
                            onChange={(e) => handleVersionChange(formGroup, e.target.value)}
                          >
                            {formGroup.versions.map((version) => (
                              <MenuItem key={version.id} value={version.version}>
                                v{version.version} {version.version === formGroup.latestVersion && '(Atual)'}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        {selectedForm.description && (
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
                            {selectedForm.description}
                          </Typography>
                        )}
                        
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip
                            label={`${getFormFieldsCount(selectedForm)} campos`}
                            size="small"
                            variant="outlined"
                          />
                          {selectedForm.createdAt && (
                            <Chip
                              label={new Date(selectedForm.createdAt).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        {selectedForm.schema?.title && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Título:</strong> {selectedForm.schema.title}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleView(selectedForm.id)}
                          variant="contained"
                          color="primary"
                        >
                          Abrir Formulário
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Search />}
                          onClick={() => handlePreview(selectedForm)}
                          variant="outlined"
                        >
                          Preview
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(selectedForm.id)}
                          variant="outlined"
                        >
                          Editar
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(selectedForm.id)}
                          color="error"
                          sx={{ ml: 'auto' }}
                        >
                          <Delete />
                        </IconButton>
                    </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Estatísticas */}
          {forms.length > 0 && (
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {forms.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Formulários
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {forms.filter(f => f.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Formulários Ativos
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
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
    </Layout>
  );
};

export default FormList;
