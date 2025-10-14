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
  const [formSchema, setFormSchema] = useState(null);
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

      // Carregar schema do formulário para renderização completa
      if (data.formId) {
        try {
          const { formService } = await import('../../api/formService');
          const formDetails = await formService.getFormById(data.formId);
          
          if (formDetails.schemaJson) {
            const parsedSchema = typeof formDetails.schemaJson === 'string' 
              ? JSON.parse(formDetails.schemaJson) 
              : formDetails.schemaJson;
            setFormSchema(parsedSchema);
          }
        } catch (schemaError) {
          // Continuar sem o schema
        }
      }
    } catch (error) {
      setError(error.message || 'Erro ao carregar submissão');
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

      switch (type) {
        case 'enviar':
          response = await submissionService.enviar(id, inputValue?.trim() || '');
          break;
        case 'aprovar':
          response = await submissionService.aprovar(id, inputValue?.trim() || '');
          break;
        case 'rejeitar':
          response = await submissionService.rejeitar(id, { 
            motivoRejeicao: inputValue.trim(),
            comentario: inputValue.trim()
          });
          break;
        case 'cancelar':
          response = await submissionService.cancelar(id, inputValue?.trim() || '');
          break;
        default:
          throw new Error('Ação não reconhecida');
      }

      setSuccess(response.mensagem || response.message || 'Ação executada com sucesso!');
      setActionDialog({
        open: false,
        type: '',
        title: '',
        message: '',
        requiresInput: false,
        inputLabel: '',
        inputValue: ''
      });

      await loadSubmission();

    } catch (error) {
      const errorMessage = error.message || 
                          error.title || 
                          error.errors?.$?.[0] || 
                          'Erro ao executar ação';
      setError(errorMessage);
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

  const handlePrint = () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Criar conteúdo HTML para impressão
    let formHtml = '';
    
    if (submission?.dataJson) {
      try {
        const formData = JSON.parse(submission.dataJson);
        
        Object.entries(formData).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') return;
          
          let displayValue = value;
          if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
          } else if (typeof value === 'boolean') {
            displayValue = value ? 'Sim' : 'Não';
          }
          
          formHtml += `
            <div style="margin-bottom: 8px; page-break-inside: avoid;">
              <div style="font-weight: bold; color: #000; margin-bottom: 3px; font-size: 12px;">${key}:</div>
              <div style="padding: 5px; border: 1px solid #000; border-radius: 2px; min-height: 18px; word-wrap: break-word; background: white; font-size: 11px;">${displayValue}</div>
            </div>
          `;
        });
      } catch (error) {
        formHtml = '<div>Erro ao processar dados do formulário.</div>';
      }
    } else {
      formHtml = '<div>Nenhum dado encontrado.</div>';
    }

    const printWindow = window.open('', '_blank', 'width=794,height=1123');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${submission?.formName || 'Formulário'}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.3;
              color: #000;
              background: white;
              height: 100vh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #000;
              flex-shrink: 0;
            }
            .logo {
              width: 60px;
              height: 60px;
              margin-right: 15px;
              flex-shrink: 0;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              color: #000;
            }
            .content {
              flex: 1;
              overflow: hidden;
            }
            @media print {
              body {
                height: auto;
                overflow: visible;
              }
              .content {
                overflow: visible;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="width: 60px; height: 60px; background: #ddd; margin-right: 15px; flex-shrink: 0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666;">LOGO</div>
            <div class="title">${submission?.formName || 'Formulário'}</div>
          </div>
          <div class="content">
            ${formHtml}
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Tentar carregar a logo
    if (printWindow.document.querySelector('.header div[style*="background: #ddd"]')) {
      const logoImg = new Image();
      logoImg.src = '/LogoSemFundo.png';
      logoImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 60;
        canvas.height = 60;
        ctx.drawImage(logoImg, 0, 0, 60, 60);
        const logoDataUrl = canvas.toDataURL('image/png');
        
        const logoDiv = printWindow.document.querySelector('.header div[style*="background: #ddd"]');
        logoDiv.innerHTML = `<img src="${logoDataUrl}" style="width: 60px; height: 60px;" alt="Logo" />`;
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      logoImg.onerror = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } else {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
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
              Visualização dos dados preenchidos
            </Typography>
          </Box>
          
          {/* Renderização do Formulário */}
          <Box sx={{ 
            p: 3,
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            flexDirection: 'column'
          }}>
            {Object.entries(formData).length === 0 ? (
              <Alert severity="info">
                Nenhum dado foi preenchido neste formulário.
              </Alert>
            ) : formSchema ? (
              // Usar FormRenderer se tiver schema
              <FormRenderer
                schema={formSchema}
                initialData={formData}
                readOnly={true}
                onSubmit={null}
              />
            ) : (
              // Fallback para exibição simples dos dados
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
        <Container maxWidth="xl" sx={{ 
          py: 3, 
          mt: '80px',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'stretch' }
        }}> {/* Adicionar margem superior e centralização mobile */}
          {/* Cabeçalho */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            width: '100%',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 0 }
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/submissions')}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            
            {/* Ações do Cabeçalho */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              ml: { xs: 0, sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 2, sm: 0 }
            }}>
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
                onClick={handlePrint}
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

          {/* Card de Status Compacto */}
          <Card sx={{ 
            mb: 4,
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: 'none', sm: 'none' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Status:
                    </Typography>
                    <SubmissionStatus status={submission?.status} />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Usuário:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {submission?.userName}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Versão:
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      v{submission?.versao}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  {availableActions.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      justifyContent: { xs: 'flex-start', md: 'flex-end' }
                    }}>
                      {availableActions.includes('enviar') && (
                        <Button
                          variant="contained"
                          startIcon={<Send />}
                          onClick={() => handleWorkflowAction('enviar')}
                          size="small"
                        >
                          Enviar
                        </Button>
                      )}
                      
                      {availableActions.includes('colocarAnalise') && (
                        <Button
                          variant="contained"
                          startIcon={<Assignment />}
                          onClick={() => handleWorkflowAction('colocarAnalise')}
                          color="warning"
                          size="small"
                        >
                          Análise
                        </Button>
                      )}
                      
                      {availableActions.includes('aprovar') && (
                        <Button
                          variant="contained"
                          startIcon={<CheckCircle />}
                          onClick={() => handleWorkflowAction('aprovar')}
                          color="success"
                          size="small"
                        >
                          Aprovar
                        </Button>
                      )}
                      
                      {availableActions.includes('rejeitar') && (
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleWorkflowAction('rejeitar')}
                          color="error"
                          size="small"
                        >
                          Rejeitar
                        </Button>
                      )}
                      
                      {availableActions.includes('cancelar') && (
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleWorkflowAction('cancelar')}
                          color="error"
                          size="small"
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Formulário Preenchido - Largura Total */}
          <Box sx={{ 
            mb: 3,
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            width: '100%'
          }}>
            <Box sx={{ 
              width: '100%',
              maxWidth: { xs: '100%', sm: 'none' }
            }}>
              {renderFormData()}
            </Box>
          </Box>

          {/* Informações Adicionais e Histórico */}
          <Grid container spacing={3}>
            {/* Detalhes Adicionais */}
            {(submission?.dataSubmissao || submission?.dataAprovacao || submission?.motivoRejeicao) && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📋 Detalhes Adicionais
                    </Typography>
                    
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
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Histórico */}
            <Grid item xs={12} md={6}>
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