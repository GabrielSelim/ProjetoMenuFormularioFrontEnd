import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Save,
  ArrowBack,
  SaveAlt,
  Send
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submissionService, canEdit } from '../../api/submissionService';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import FormRenderer from '../../components/FormRenderer';
import FormEngineRenderer from '../../components/FormEngineRenderer';

const SubmissionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Estados principais
  const [submission, setSubmission] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de controle
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Auto-save timer
  const autoSaveTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadSubmission();
    
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [id]);

  // Auto-save quando há mudanças
  useEffect(() => {
    if (hasChanges && submission && !saving) {
      // Cancelar timer anterior se existir
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Configurar novo timer para auto-save em 30 segundos
      autoSaveTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && hasChanges) {
          autoSave();
        }
      }, 30000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, hasChanges, submission, saving]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await submissionService.getById(id);
      
      // Verificar se usuário pode editar
      if (!canEdit(data, user?.role)) {
        setError('Você não tem permissão para editar esta submissão');
        return;
      }
      
      setSubmission(data);
      
      // Parse dos dados do formulário
      if (data.dataJson) {
        try {
          const parsedData = JSON.parse(data.dataJson);
          setFormData(parsedData);
        } catch (parseError) {
          console.error('Erro ao fazer parse dos dados:', parseError);
          setError('Dados do formulário estão em formato inválido');
          return;
        }
      }

      // Carregar schema do formulário (se necessário)
      // O schema geralmente já vem junto com a submissão ou pode ser carregado separadamente
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
          console.error('Erro ao carregar schema:', schemaError);
          // Continuar mesmo sem o schema, usando o renderer padrão
        }
      }

    } catch (error) {
      setError(error.message || 'Erro ao carregar submissão');
      console.error('Erro ao carregar submissão:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    if (!submission || saving || !hasChanges) return;

    try {
      setSaving(true);
      
      const updateData = {
        dataJson: JSON.stringify(formData),
        versao: submission.versao
      };

      await submissionService.update(id, updateData);
      
      setHasChanges(false);
      setLastSaved(new Date());
      
      // Atualizar versão local
      setSubmission(prev => ({
        ...prev,
        versao: prev.versao + 1,
        dataAtualizacao: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Auto-save falhou:', error);
      // Não exibir erro para o usuário no auto-save
    } finally {
      setSaving(false);
    }
  };

  const handleFormDataChange = useCallback((newData) => {
    setFormData(newData);
    setHasChanges(true);
  }, []);

  const handleSaveAndSubmit = async () => {
    if (!submission) return;

    try {
      setSaving(true);
      setError('');

      // Primeiro salvar os dados atualizados
      const updateData = {
        dataJson: JSON.stringify(formData),
        versao: submission.versao
      };

      await submissionService.update(id, updateData);

      // Depois enviar para análise
      await submissionService.enviar(id, {
        observacoes: 'Submissão atualizada e enviada'
      });

      setSuccess('Submissão salva e enviada com sucesso!');
      
      // Redirecionar após delay
      setTimeout(() => {
        navigate('/submissions', {
          state: { message: 'Submissão atualizada e enviada com sucesso!' }
        });
      }, 2000);

    } catch (error) {
      setError(error.message || 'Erro ao salvar e enviar submissão');
      console.error('Erro ao salvar e enviar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOnly = async () => {
    if (!submission) return;

    try {
      setSaving(true);
      setError('');

      const updateData = {
        dataJson: JSON.stringify(formData),
        versao: submission.versao
      };

      const response = await submissionService.update(id, updateData);
      
      setSuccess(response.mensagem || 'Submissão salva com sucesso!');
      setHasChanges(false);
      setLastSaved(new Date());
      
      // Atualizar versão local
      setSubmission(prev => ({
        ...prev,
        versao: prev.versao + 1,
        dataAtualizacao: new Date().toISOString()
      }));

    } catch (error) {
      setError(error.message || 'Erro ao salvar submissão');
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setConfirmDialog(true);
    } else {
      navigate('/submissions');
    }
  };

  const handleConfirmExit = () => {
    setConfirmDialog(false);
    navigate('/submissions');
  };

  const renderForm = () => {
    if (!formSchema) {
      // Fallback para renderer simples se não tiver schema do FormEngine
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Modo de Edição Simples
          </Typography>
          <Typography>
            Schema do FormEngine.io não encontrado. Usando editor básico de dados.
          </Typography>
          
          {/* Editor simples dos dados JSON */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Dados atuais:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(formData, null, 2)}
              </pre>
            </Paper>
          </Box>
        </Alert>
      );
    }

    // Tentar usar FormEngine.io primeiro
    if (formSchema.formEngineSchema) {
      return (
        <FormEngineRenderer
          formSchema={formSchema}
          data={formData}
          onChange={handleFormDataChange}
          readOnly={false}
        />
      );
    }

    // Fallback para renderer padrão
    if (formSchema.fields) {
      return (
        <FormRenderer
          schema={formSchema}
          initialData={formData}
          onSubmit={handleFormDataChange}
          readOnly={false}
        />
      );
    }

    return (
      <Alert severity="warning">
        Formato de schema não suportado para edição.
      </Alert>
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Cabeçalho */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1">
                ✏️ Editando: {submission?.formName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Submissão #{submission?.id} • Versão {submission?.versao}
              </Typography>
            </Box>
            
            {/* Indicadores de Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              {hasChanges && (
                <Chip
                  icon={<SaveAlt />}
                  label="Alterações não salvas"
                  color="warning"
                  size="small"
                />
              )}
              
              {lastSaved && (
                <Chip
                  label={`Salvo às ${lastSaved.toLocaleTimeString('pt-BR')}`}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
              
              {saving && (
                <Chip
                  icon={<CircularProgress size={16} />}
                  label="Salvando..."
                  color="primary"
                  size="small"
                />
              )}
            </Box>
            
            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSaveOnly}
                disabled={saving || !hasChanges}
              >
                Salvar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleSaveAndSubmit}
                disabled={saving}
              >
                Salvar e Enviar
              </Button>
            </Box>
          </Box>

          {/* Status da Submissão */}
          <Alert 
            severity={submission?.status === 0 ? 'info' : 'warning'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Status Atual: {submission?.status === 0 ? 'Rascunho' : 'Outros'}
            </Typography>
            <Typography variant="body2">
              {submission?.status === 0 
                ? 'Você pode editar e salvar alterações. Use "Salvar e Enviar" quando estiver pronto para submeter.'
                : 'Esta submissão já foi enviada. Verifique se você tem permissão para fazer alterações.'
              }
            </Typography>
          </Alert>

          {/* Mensagens de Erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📝 Dados do Formulário
            </Typography>
            
            {renderForm()}
          </Paper>
        </Container>
      </Box>

      {/* Dialog de Confirmação para Sair */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Descartar Alterações?</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem alterações não salvas. Deseja realmente sair sem salvar?
          </Typography>
          {hasChanges && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              As alterações serão perdidas permanentemente.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveOnly} variant="outlined" disabled={saving}>
            Salvar e Sair
          </Button>
          <Button onClick={handleConfirmExit} color="error">
            Descartar e Sair
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

export default SubmissionEdit;