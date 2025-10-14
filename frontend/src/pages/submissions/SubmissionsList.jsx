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
  Snackbar
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  Send,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submissionService, StatusSubmissaoLabels, StatusSubmissaoColors } from '../../api/submissionService';
import { formService } from '../../api/formService';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

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
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>ID:</strong> {submission.id}
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
    status: '',
    search: '',
    dataInicio: '',
    dataFim: '',
    usuarioId: ''
  });
  const [pagination, setPagination] = useState({
    paginaAtual: 1,
    totalPaginas: 1,
    totalItens: 0,
    tamanhoPagina: 12
  });

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
  }, [filters, pagination.paginaAtual]);

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
        pagina: pagination.paginaAtual,
        tamanhoPagina: pagination.tamanhoPagina,
        ...filters
      };
      
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
    setPagination(prev => ({ ...prev, paginaAtual: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, paginaAtual: newPage }));
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
      },
      colocarAnalise: {
        title: 'Colocar em Análise',
        message: `Deseja colocar a submissão "${submission?.formName}" em análise?`,
        requiresInput: false
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
          response = await submissionService.enviar(submissionId, actionData);
          break;
        case 'aprovar':
          response = await submissionService.aprovar(submissionId, actionData);
          break;
        case 'rejeitar':
          response = await submissionService.rejeitar(submissionId, { motivo: inputValue.trim() });
          break;
        case 'cancelar':
          response = await submissionService.cancelar(submissionId, { motivo: inputValue.trim() });
          break;
        case 'colocarAnalise':
          response = await submissionService.colocarAnalise(submissionId, actionData);
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3, mt: '80px' }}> {/* Adicionar margem superior */}
          {/* Cabeçalho */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', // Mudar para flex-start
            mb: 3,
            gap: 2 // Adicionar gap
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                📋 Minhas Submissões
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {pagination.totalItens} submissão(ões) encontrada(s)
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/forms')}
              size="large"
              sx={{ 
                minWidth: '180px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Nova Submissão
            </Button>
          </Box>

          {/* Mensagens de Erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Filtros Simples */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Buscar"
                size="small"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                sx={{ flex: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={() => {
                  setFilters({
                    formId: '',
                    status: '',
                    search: '',
                    dataInicio: '',
                    dataFim: '',
                    usuarioId: ''
                  });
                  loadSubmissions();
                }}
              >
                Limpar Filtros
              </Button>
            </Stack>
          </Box>

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
                    <Grid item xs={12} sm={6} md={4} key={submission.id}>
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

              {/* Paginação */}
              {pagination.totalPaginas > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPaginas}
                    page={pagination.paginaAtual}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

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
    </Box>
  );
};

export default SubmissionsList;