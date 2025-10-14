import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Print,
  History,
  Assignment,
  CheckCircle,
  Cancel,
  Send,
  Person,
  CalendarToday,
  Description
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submissionService, getAvailableActions, getAcaoLabel } from '../../api/submissionService';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import SubmissionStatus from '../../components/submissions/SubmissionStatus';
import FormRenderer from '../../components/FormRenderer';

const SubmissionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principais
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para ações
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: '',
    title: '',
    message: '',
    requiresInput: false,
    inputLabel: '',
    inputValue: ''
  });

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await submissionService.getById(id);
      setSubmission(data);
    } catch (error) {
      setError(error.message || 'Erro ao carregar submissão');
      console.error('Erro ao carregar submissão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowAction = (action) => {
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
      const { type, inputValue, requiresInput } = actionDialog;

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
        case 'enviar':
          response = await submissionService.enviar(id, actionData);
          break;
        case 'aprovar':
          response = await submissionService.aprovar(id, actionData);
          break;
        case 'rejeitar':
          response = await submissionService.rejeitar(id, { motivo: inputValue.trim() });
          break;
        case 'cancelar':
          response = await submissionService.cancelar(id, { motivo: inputValue.trim() });
          break;
        case 'colocarAnalise':
          response = await submissionService.colocarAnalise(id, actionData);
          break;
        default:
          throw new Error('Ação não reconhecida');
      }

      setSuccess(response.mensagem || 'Ação executada com sucesso!');
      setActionDialog({
        open: false,
        type: '',
        title: '',
        message: '',
        requiresInput: false,
        inputLabel: '',
        inputValue: ''
      });

      // Recarregar submissão
      await loadSubmission();

    } catch (error) {
      setError(error.message || 'Erro ao executar ação');
      console.error('Erro na ação:', error);
    }
  };

  const handleActionCancel = () => {
    setActionDialog({
      open: false,
      type: '',
      title: '',
      message: '',
      requiresInput: false,
      inputLabel: '',
      inputValue: ''
    });
  };

  const renderFormData = () => {
    if (!submission?.dataJson) return null;

    try {
      const formData = JSON.parse(submission.dataJson);
      
      return (
        <Paper sx={{ p: 0, overflow: 'hidden' }}>
          {/* Header do Formulário */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600
            }}>
              <Description /> {submission.formName}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Dados preenchidos pelo usuário
            </Typography>
          </Box>
          
          {/* Conteúdo do Formulário */}
          <Box sx={{ p: 3 }}>
            {Object.entries(formData).length === 0 ? (
              <Alert severity="info">
                Nenhum dado foi preenchido neste formulário.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(formData).map(([key, value], index) => {
                  // Formatação mais inteligente dos valores
                  let displayValue = value;
                  let isLongText = false;
                  
                  if (typeof value === 'object' && value !== null) {
                    displayValue = JSON.stringify(value, null, 2);
                    isLongText = true;
                  } else if (typeof value === 'string' && value.length > 100) {
                    isLongText = true;
                    displayValue = value;
                  } else if (value === null || value === undefined || value === '') {
                    displayValue = '(não preenchido)';
                  } else {
                    displayValue = String(value);
                  }
                  
                  return (
                    <Box key={key} sx={{ 
                      position: 'relative',
                      '&:not(:last-child)::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-12px',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
                      }
                    }}>
                      {/* Label do Campo */}
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'primary.main',
                          mb: 1,
                          textTransform: 'capitalize'
                        }}
                      >
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                      
                      {/* Valor do Campo */}
                      <Box sx={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        p: 2,
                        minHeight: isLongText ? '100px' : '50px',
                        display: 'flex',
                        alignItems: isLongText ? 'flex-start' : 'center'
                      }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            whiteSpace: isLongText ? 'pre-wrap' : 'normal',
                            color: displayValue === '(não preenchido)' ? 'text.secondary' : 'text.primary',
                            fontStyle: displayValue === '(não preenchido)' ? 'italic' : 'normal',
                            width: '100%'
                          }}
                        >
                          {displayValue}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
          
          {/* Footer com informações extras */}
          <Box sx={{ 
            backgroundColor: '#f5f5f5',
            p: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="caption" color="text.secondary">
              📋 {Object.entries(formData).length} campo(s) preenchido(s) • 
              🕐 Submetido em {submission.createdAt && new Date(submission.createdAt).toLocaleString('pt-BR')}
            </Typography>
          </Box>
        </Paper>
      );
    } catch (error) {
      return (
        <Alert severity="warning">
          Erro ao processar dados do formulário: {error.message}
        </Alert>
      );
    }
  };

  const renderHistorico = () => {
    if (!submission?.historicos || submission.historicos.length === 0) {
      return (
        <Alert severity="info">
          Nenhum histórico encontrado para esta submissão.
        </Alert>
      );
    }

    return (
      <List>
        {submission.historicos.map((item, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <History />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${getAcaoLabel(item.acao)} - ${item.usuarioName}`}
              secondary={
                <Box component="span">
                  <Box component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.875rem' }}>
                    {new Date(item.dataAcao).toLocaleString('pt-BR')}
                  </Box>
                  {item.comentario && (
                    <Box component="span" sx={{ display: 'block', mt: 1, fontSize: '0.875rem' }}>
                      {item.comentario}
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header />
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress size={60} />
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  if (error && !submission) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header />
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/submissions')}
            >
              Voltar para Lista
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const availableActions = submission ? getAvailableActions(submission, user?.role) : [];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3, mt: '80px' }}> {/* Adicionar margem superior */}
          {/* Cabeçalho */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/submissions')}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1">
                📋 {submission?.formName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Submissão #{submission?.id}
              </Typography>
            </Box>
            
            {/* Ações do Cabeçalho */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {availableActions.includes('editar') && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/submissions/${id}/edit`)}
                >
                  Editar
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>
            </Box>
          </Box>

          {/* Mensagens de Erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Dados Principais */}
            <Grid item xs={12} md={8}>
              {renderFormData()}
            </Grid>

            {/* Informações Laterais */}
            <Grid item xs={12} md={4}>
              {/* Status e Informações */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment /> Informações
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status:
                    </Typography>
                    <SubmissionStatus status={submission?.status} />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <Person sx={{ fontSize: 16, mr: 0.5 }} />
                      Usuário:
                    </Typography>
                    <Typography variant="body1">
                      {submission?.userName} ({submission?.userEmail})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                      Criado em:
                    </Typography>
                    <Typography variant="body1">
                      {submission?.createdAt && new Date(submission.createdAt).toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  
                  {submission?.dataSubmissao && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Submetido em:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(submission.dataSubmissao).toLocaleString('pt-BR')}
                      </Typography>
                    </Box>
                  )}
                  
                  {submission?.dataAprovacao && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Aprovado em:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(submission.dataAprovacao).toLocaleString('pt-BR')}
                      </Typography>
                      {submission.usuarioAprovadorName && (
                        <Typography variant="body2" color="text.secondary">
                          Por: {submission.usuarioAprovadorName}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {submission?.motivoRejeicao && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="error" gutterBottom>
                        Motivo da Rejeição:
                      </Typography>
                      <Typography variant="body1">
                        {submission.motivoRejeicao}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Versão:
                    </Typography>
                    <Typography variant="body1">
                      {submission?.versao}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Ações de Workflow */}
              {availableActions.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ⚡ Ações Disponíveis
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {availableActions.includes('enviar') && (
                        <Button
                          variant="contained"
                          startIcon={<Send />}
                          onClick={() => handleWorkflowAction('enviar')}
                          fullWidth
                        >
                          Enviar
                        </Button>
                      )}
                      
                      {availableActions.includes('colocarAnalise') && (
                        <Button
                          variant="contained"
                          startIcon={<Assignment />}
                          onClick={() => handleWorkflowAction('colocarAnalise')}
                          fullWidth
                          color="warning"
                        >
                          Colocar em Análise
                        </Button>
                      )}
                      
                      {availableActions.includes('aprovar') && (
                        <Button
                          variant="contained"
                          startIcon={<CheckCircle />}
                          onClick={() => handleWorkflowAction('aprovar')}
                          fullWidth
                          color="success"
                        >
                          Aprovar
                        </Button>
                      )}
                      
                      {availableActions.includes('rejeitar') && (
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleWorkflowAction('rejeitar')}
                          fullWidth
                          color="error"
                        >
                          Rejeitar
                        </Button>
                      )}
                      
                      {availableActions.includes('cancelar') && (
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleWorkflowAction('cancelar')}
                          fullWidth
                          color="error"
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Histórico */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History /> Histórico
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {renderHistorico()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
            color={actionDialog.type === 'rejeitar' || actionDialog.type === 'cancelar' ? 'error' : 'primary'}
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

export default SubmissionView;