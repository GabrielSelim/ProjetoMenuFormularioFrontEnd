import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Pagination,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Autocomplete
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  Send,
  CheckCircle,
  Cancel,
  FilterList,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submissionService, StatusSubmissaoLabels, StatusSubmissaoColors } from '../../api/submissionService';
import { formService } from '../../api/formService';
import Layout from '../../components/Layout';

// Componente de Card simples
const SubmissionCard = ({ submission, onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      0: 'default', // Rascunho
      1: 'primary', // Enviado
      2: 'warning', // Em Análise
      3: 'success', // Aprovado
      4: 'error',   // Rejeitado
      5: 'default'  // Cancelado
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    return StatusSubmissaoLabels[status] || 'Desconhecido';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          📋 {submission.formName || submission.nomeFormulario || `Formulário ${submission.formId}`}
        </Typography>
        

        
        {submission.userName && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Usuário:</strong> {submission.userName}
          </Typography>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={getStatusLabel(submission.status)}
            color={getStatusColor(submission.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Criado:</strong> {new Date(submission.createdAt || submission.dataCriacao).toLocaleDateString('pt-BR')}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<Visibility />}
          onClick={() => onView(submission.id)}
        >
          Ver
        </Button>
        <Button 
          size="small" 
          startIcon={<Edit />}
          onClick={() => onEdit(submission.id)}
        >
          Editar
        </Button>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => { onDelete(submission.id); setAnchorEl(null); }}>
            <Delete sx={{ mr: 1 }} />
            Excluir
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

const SubmissionsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Estados principais
  const [submissions, setSubmissions] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de filtros e paginação
  const [filters, setFilters] = useState({
    formId: '',
    userId: '',
    status: '',
    dataInicialCriacao: '',
    dataFinalCriacao: '',
    dataInicialSubmissao: '',
    dataFinalSubmissao: '',
    usuarioAprovadorId: '',
    incluirExcluidas: false
  });
  const [pagination, setPagination] = useState({
    pagina: 1,
    totalPaginas: 1,
    totalItens: 0,
    tamanhoPagina: 12
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Estados de modais e ações
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: '',
    submissionId: null,
    title: '',
    message: '',
    requiresInput: false,
    inputLabel: '',
    inputValue: ''
  });

  // Carregar dados iniciais e configurar filtros baseado no state
  useEffect(() => {
    // Verificar se veio redirecionamento do FormView
    if (location.state?.filterByForm) {
      setFilters(prev => ({
        ...prev,
        formId: location.state.filterByForm
      }));
      
      // Encontrar e definir o formulário selecionado
      const formId = location.state.filterByForm;
      const form = forms.find(f => f.id == formId);
      if (form) {
        setSelectedForm(form);
      }
      
      // Mostrar mensagem de sucesso se fornecida
      if (location.state.message) {
        setSuccess(location.state.message);
      }
    }
    
    loadInitialData();
  }, [location.state]);

  // Recarregar quando filtros ou página mudam
  useEffect(() => {
    loadSubmissions();
  }, [filters, pagination.pagina]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadForms(),
        loadSubmissions()
      ]);
    } catch (error) {
      setError('Erro ao carregar dados iniciais');
    } finally {
      setLoading(false);
    }
  };

  const loadForms = async () => {
    try {
      const formsData = await formService.getForms();
      
      // Garantir que seja array
      if (Array.isArray(formsData)) {
        setForms(formsData);
      } else if (formsData && Array.isArray(formsData.items)) {
        setForms(formsData.items);
      } else if (formsData && Array.isArray(formsData.data)) {
        setForms(formsData.data);
      } else {
        setForms([]);
      }
    } catch (error) {
      setForms([]);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError('');

      // Preparar parâmetros para a API
      const params = {
        pagina: pagination.pagina,
        tamanhoPagina: pagination.tamanhoPagina,
        campoOrdenacao: 'dataAtualizacao',
        direcaoOrdenacao: 'desc'
      };

      // Adicionar filtros apenas se preenchidos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params[key] = value;
        }
      });
      
      // Chamar API real - SEM FALLBACK MOCKADO
      const response = await submissionService.getAll(params);
            
      // Garantir que sempre seja um array
      let submissionsData = [];
      
      if (Array.isArray(response)) {
        submissionsData = response;
      } else if (response && Array.isArray(response.itens)) {
        submissionsData = response.itens;
      } else if (response && Array.isArray(response.items)) {
        submissionsData = response.items;
      } else if (response && Array.isArray(response.data)) {
        submissionsData = response.data;
      } else if (response && Array.isArray(response.result)) {
        submissionsData = response.result;
      } else {
        submissionsData = [];
      }
      
      setSubmissions(submissionsData);
      
      // Atualizar informações de paginação se retornadas pela API
      if (response && typeof response.totalItens !== 'undefined') {
        setPagination(prev => ({
          ...prev,
          totalItens: response.totalItens,
          totalPaginas: Math.ceil(response.totalItens / prev.tamanhoPagina)
        }));
      } else if (response && typeof response.total !== 'undefined') {
        setPagination(prev => ({
          ...prev,
          totalItens: response.total,
          totalPaginas: Math.ceil(response.total / prev.tamanhoPagina)
        }));
      } else {
        // Se não houver informação de paginação, usar o tamanho do array
        setPagination(prev => ({
          ...prev,
          totalItens: submissionsData.length,
          totalPaginas: Math.ceil(submissionsData.length / prev.tamanhoPagina)
        }));
      }

    } catch (error) {
      setError(`Erro ao conectar com a API: ${error.message}`);
      setSubmissions([]);
      
      // Limpar paginação em caso de erro
      setPagination(prev => ({
        ...prev,
        totalItens: 0,
        totalPaginas: 1
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pagina: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, pagina: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      formId: '',
      userId: '',
      status: '',
      dataInicialCriacao: '',
      dataFinalCriacao: '',
      dataInicialSubmissao: '',
      dataFinalSubmissao: '',
      usuarioAprovadorId: '',
      incluirExcluidas: false
    });
    setSelectedForm(null);
    setPagination(prev => ({ ...prev, pagina: 1 }));
  };

  const handleView = (submissionId) => {
    navigate(`/submissions/${submissionId}`);
  };

  const handleEdit = (submissionId) => {
    navigate(`/submissions/${submissionId}/edit`);
  };

  const handleDelete = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    setActionDialog({
      open: true,
      type: 'delete',
      submissionId,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a submissão "${submission?.formName}"?`,
      requiresInput: true,
      inputLabel: 'Motivo da exclusão (obrigatório)',
      inputValue: ''
    });
  };

  const handleWorkflowAction = (submissionId, action) => {
    const submission = submissions.find(s => s.id === submissionId);
    const actionConfigs = {
      enviar: {
        title: 'Enviar Submissão',
        message: `Deseja enviar a submissão "${submission?.formName}" para análise?`,
        requiresInput: false
      },
      aprovar: {
        title: 'Aprovar Submissão',
        message: `Deseja aprovar a submissão "${submission?.formName}"?`,
        requiresInput: false
      },
      rejeitar: {
        title: 'Rejeitar Submissão',
        message: `Deseja rejeitar a submissão "${submission?.formName}"?`,
        requiresInput: true,
        inputLabel: 'Motivo da rejeição (obrigatório)'
      },
      cancelar: {
        title: 'Cancelar Submissão',
        message: `Deseja cancelar a submissão "${submission?.formName}"?`,
        requiresInput: true,
        inputLabel: 'Motivo do cancelamento (obrigatório)'
      }
    };

    const config = actionConfigs[action];
    if (config) {
      setActionDialog({
        open: true,
        type: action,
        submissionId,
        title: config.title,
        message: config.message,
        requiresInput: config.requiresInput,
        inputLabel: config.inputLabel || '',
        inputValue: ''
      });
    }
  };

  const handleActionConfirm = async () => {
    try {
      const { type, submissionId, inputValue, requiresInput } = actionDialog;

      if (requiresInput && !inputValue.trim()) {
        setError('Campo obrigatório não preenchido');
        return;
      }

      let response;
      const actionData = requiresInput ? { 
        motivo: inputValue.trim(),
        observacoes: inputValue.trim()
      } : {};

      switch (type) {
        case 'delete':
          response = await submissionService.delete(submissionId, inputValue.trim());
          break;
        case 'enviar':
          response = await submissionService.enviar(submissionId, inputValue?.trim() || '');
          break;
        case 'aprovar':
          response = await submissionService.aprovar(submissionId, inputValue?.trim() || '');
          break;
        case 'rejeitar':
          response = await submissionService.rejeitar(submissionId, { 
            motivoRejeicao: inputValue.trim(),
            comentario: inputValue.trim()
          });
          break;
        case 'cancelar':
          response = await submissionService.cancelar(submissionId, inputValue?.trim() || '');
          break;
        default:
          throw new Error('Ação não reconhecida');
      }

      setSuccess(response.mensagem || 'Ação executada com sucesso!');
      setActionDialog({
        open: false,
        type: '',
        submissionId: null,
        title: '',
        message: '',
        requiresInput: false,
        inputLabel: '',
        inputValue: ''
      });

      // Recarregar lista
      await loadSubmissions();

    } catch (error) {
      setError(error.message || 'Erro ao executar ação');
    }
  };

  const handleActionCancel = () => {
    setActionDialog({
      open: false,
      type: '',
      submissionId: null,
      title: '',
      message: '',
      requiresInput: false,
      inputLabel: '',
      inputValue: ''
    });
  };

  return (
    <Layout>
      <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              📋 Minhas Submissões
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/forms')}
              >
                Nova Submissão
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {pagination.totalItens} submissão(ões) encontrada(s)
          </Typography>

          {/* Mensagens de Erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Card sx={{ mb: 3, position: 'relative', zIndex: 1, overflow: 'visible' }}>
            <CardContent sx={{ pb: 2, overflow: 'visible' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: { xs: 2, md: 3 }
              }}>
                <Typography variant="h6">
                  Filtros
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterList />}
                  endIcon={showMobileFilters ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    minWidth: 'auto'
                  }}
                >
                  {showMobileFilters ? 'Ocultar' : 'Mostrar'}
                </Button>
              </Box>
              
              <Box sx={{
                display: { xs: showMobileFilters ? 'block' : 'none', md: 'block' },
                overflow: 'visible'
              }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ position: 'relative' }}>
                    <Autocomplete
                      disablePortal
                      options={forms}
                      getOptionLabel={(option) => option.name || option.title || `Formulário ${option.id}`}
                      value={selectedForm}
                      onChange={(event, newValue) => {
                        setSelectedForm(newValue);
                        setFilters(prev => ({ ...prev, formId: newValue ? newValue.id : '' }));
                      }}
                      fullWidth
                      size="small"
                      sx={{ 
                        width: { xs: '100%', sm: '100%', md: 400 },
                        minWidth: 300,
                        position: 'relative',
                        '& .MuiAutocomplete-paper': {
                          minWidth: '400px !important',
                          maxHeight: '300px',
                          overflow: 'auto',
                          zIndex: 10000,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          position: 'absolute !important',
                          top: '100% !important',
                          left: '0 !important',
                          right: 'auto !important',
                          marginTop: '4px !important',
                          transform: 'none !important',
                          transition: 'none !important',
                          animation: 'none !important'
                        },
                        '& .MuiAutocomplete-listbox': {
                          maxHeight: '300px'
                        }
                      }}                 
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Formulário"
                          size="small"
                          placeholder="Digite para buscar..."
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      noOptionsText="Nenhum formulário encontrado"
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 12, md: 2.5 }}>
                    <TextField
                      select
                      label="Status"
                      size="small"
                      fullWidth
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      SelectProps={{ 
                        native: true,
                        displayEmpty: true
                      }}
                      InputLabelProps={{ shrink: true }}
                    >
                      <option value="">Selecione o status</option>
                      <option value="0">Rascunho</option>
                      <option value="1">Enviado</option>
                      <option value="2">Em Análise</option>
                      <option value="3">Aprovado</option>
                      <option value="4">Rejeitado</option>
                      <option value="5">Cancelado</option>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2.75 }}>
                    <TextField
                      label="Data Inicial"
                      type="date"
                      size="small"
                      fullWidth
                      value={filters.dataInicialCriacao}
                      onChange={(e) => setFilters(prev => ({ ...prev, dataInicialCriacao: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 2.75 }}>
                    <TextField
                      label="Data Final"
                      type="date"
                      size="small"
                      fullWidth
                      value={filters.dataFinalCriacao}
                      onChange={(e) => setFilters(prev => ({ ...prev, dataFinalCriacao: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2, 
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                  <Button 
                    variant="outlined" 
                    onClick={clearFilters}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Limpar Filtros
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={loadSubmissions}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Buscar
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Lista de Submissões */}
          {!loading && (
            <>
              {!Array.isArray(submissions) || submissions.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Nenhuma submissão encontrada
                  </Typography>
                  <Typography>
                    {Object.values(filters).some(v => v) 
                      ? 'Tente ajustar os filtros ou criar uma nova submissão.'
                      : 'Comece criando sua primeira submissão de formulário.'
                    }
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/forms')}
                    sx={{ mt: 2 }}
                  >
                    Criar Primeira Submissão
                  </Button>
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {Array.isArray(submissions) && submissions.map((submission) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={submission.id}>
                      <SubmissionCard
                        submission={submission}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {pagination.totalPaginas > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Stack spacing={2} alignItems="center">
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      textAlign="center"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Página {pagination.pagina} de {pagination.totalPaginas} • {pagination.totalItens} item(s)
                    </Typography>
                    <Pagination
                      count={pagination.totalPaginas}
                      page={pagination.pagina}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      siblingCount={1}
                      boundaryCount={1}
                      sx={{
                        '& .MuiPagination-ul': {
                          flexWrap: 'wrap',
                          justifyContent: 'center'
                        },
                        '& .MuiPaginationItem-root': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          minWidth: { xs: '28px', sm: '32px' },
                          height: { xs: '28px', sm: '32px' }
                        }
                      }}
                    />
                  </Stack>
                </Box>
              )}
            </>
          )}
        </Container>

      {/* Dialog de Confirmação de Ações */}
      <Dialog
        open={actionDialog.open}
        onClose={handleActionCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{actionDialog.title}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {actionDialog.message}
          </Typography>
          
          {actionDialog.requiresInput && (
            <TextField
              autoFocus
              margin="dense"
              label={actionDialog.inputLabel}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={actionDialog.inputValue}
              onChange={(e) => setActionDialog(prev => ({
                ...prev,
                inputValue: e.target.value
              }))}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionCancel}>Cancelar</Button>
          <Button 
            onClick={handleActionConfirm} 
            variant="contained"
            color={actionDialog.type === 'delete' || actionDialog.type === 'rejeitar' || actionDialog.type === 'cancelar' ? 'error' : 'primary'}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de Sucesso */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default SubmissionsList;