import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Save,
  Preview,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { formService } from '../api/formService';
import FormBuilderAlternative from '../components/FormBuilderAlternative';
import FormViewerSimple from '../components/FormViewerSimple';
import 'rsuite/dist/rsuite.min.css';
import '../styles/formengine-custom.css';
import '../mobx-config';

const FormBuilderAdvanced = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edição
  const formBuilderRef = useRef();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    rolesAllowed: 'admin,user,manager',
    version: '1.0'
  });
  const [form, setForm] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Carregar formulário para edição
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadFormForEdit(id);
    }
  }, [id]);

  const loadFormForEdit = async (formId) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando formulário para edição:', formId);
      const formToEdit = await formService.getFormById(formId);
      console.log('Formulário carregado:', formToEdit);
      
      if (!formToEdit) {
        setError('Formulário não encontrado');
        return;
      }
      
      // Debug: verificar estrutura do formulário carregado
      console.log('=== DEBUGGING FORM LOAD ===');
      console.log('formToEdit completo:', formToEdit);
      console.log('formToEdit.schema:', formToEdit.schema);
      
      let parsedSchema = null;
      if (typeof formToEdit.schemaJson === 'string') {
        try {
          parsedSchema = JSON.parse(formToEdit.schemaJson);
          console.log('Schema parseado de string:', parsedSchema);
        } catch (e) {
          console.error('Erro ao parsear schemaJson:', e);
        }
      } else if (typeof formToEdit.schemaJson === 'object') {
        parsedSchema = formToEdit.schemaJson;
        console.log('Schema já é objeto:', parsedSchema);
      }

      // Usar o schema parseado ou o schema já existente
      const schema = parsedSchema || formToEdit.schema;
      console.log('Schema final usado:', schema);

      // Carregar dados básicos do formulário
      const newFormData = {
        name: formToEdit.name || '',
        title: schema?.title || formToEdit.name || '', // Fallback para name se não tiver title
        description: schema?.description || '',
        rolesAllowed: formToEdit.rolesAllowed || 'admin,user,manager',
        version: formToEdit.version || '1.0'
      };
      
      console.log('Setando formData para:', newFormData);
      setFormData(newFormData);
      
      // Extrair o form do FormEngine se disponível
      let extractedForm = null;
      
      if (schema?.formEngineSchema?.form) {
        console.log('Form do FormEngine encontrado:', schema.formEngineSchema.form);
        extractedForm = schema.formEngineSchema.form;
      } else if (schema?.formEngineSchema && typeof schema.formEngineSchema === 'object') {
        // Talvez o formEngineSchema seja o próprio form
        console.log('Tentando usar formEngineSchema como form:', schema.formEngineSchema);
        extractedForm = schema.formEngineSchema;
      } else {
        console.log('Nenhum form do FormEngine encontrado');
        console.log('Estrutura do formEngineSchema:', schema?.formEngineSchema);
      }
      
      if (extractedForm) {
        console.log('Setando form extraído:', extractedForm);
        setForm(extractedForm);
      }
      
    } catch (err) {
      console.error('Erro ao carregar formulário para edição:', err);
      setError(err.message || 'Erro ao carregar formulário');
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar o formulário
  const handleSaveForm = async () => {
    console.log('handleSaveForm called');

    if (!formData.name || !formData.title) {
      setError('Nome e título são obrigatórios');
      return;
    }

    // Pegar o formulário atual do FormBuilder
    const currentForm = formBuilderRef.current?.getCurrentForm();
    console.log('Current form from builder:', currentForm);

    if (!currentForm || !currentForm.children || currentForm.children.length === 0) {
      setError('Adicione pelo menos um campo ao formulário');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const schemaData = {
        title: formData.title,
        description: formData.description,
        formEngineSchema: { form: currentForm },
        fields: []
      };
      
      console.log('=== SAVING FORM ===');
      console.log('currentForm sendo salvo:', currentForm);
      console.log('schemaData completo:', schemaData);
      
      const formPayload = {
        name: formData.name,
        schemaJson: JSON.stringify(schemaData),
        rolesAllowed: formData.rolesAllowed,
        version: formData.version
      };

      if (isEditMode && id) {
        await formService.updateForm(id, formPayload);
        setSuccess('Formulário atualizado com sucesso!');
      } else {
        await formService.createForm(formPayload);
        setSuccess('Formulário criado com sucesso!');
      }
      
      setTimeout(() => {
        navigate('/forms');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar formulário');
    } finally {
      setSaving(false);
    }
  };

  // Função para preview
  const handlePreview = () => {
    const currentForm = formBuilderRef.current?.getCurrentForm();
    console.log('=== PREVIEW DEBUG ===');
    console.log('currentForm:', currentForm);
    console.log('currentForm type:', typeof currentForm);
    console.log('currentForm.children:', currentForm?.children);
    console.log('===================');
    
    if (!currentForm || !currentForm.children || currentForm.children.length === 0) {
      setError('Adicione campos ao formulário para visualizar');
      return;
    }
    setForm(currentForm); // Atualizar o state para o preview
    setPreviewOpen(true);
  };

  // Loading para edição
  if (loading && isEditMode) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box textAlign="center">
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography>Carregando formulário para edição...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        width: '100%',
        p: 2
      }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/forms')}
              variant="outlined"
              size="small"
            >
              Voltar
            </Button>
            <Typography variant="h5" component="h1">
              {isEditMode ? 'Editar Formulário Avançado' : 'Construtor Avançado de Formulários'}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={handlePreview}
              size="small"
            >
              Visualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveForm}
              disabled={saving}
              size="small"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}



        {/* Configurações do Formulário */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nome do Formulário"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Título do Formulário"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Roles Permitidos"
                value={formData.rolesAllowed}
                onChange={(e) => setFormData({ ...formData, rolesAllowed: e.target.value })}
                size="small"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="admin">Apenas Admin</option>
                <option value="admin,manager">Admin e Manager</option>
                <option value="admin,user">Admin e User</option>
                <option value="admin,user,manager">Todos (Admin, User, Manager)</option>
                <option value="user">Apenas User</option>
                <option value="manager">Apenas Manager</option>
                <option value="user,manager">User e Manager</option>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Form Builder */}
        <Paper sx={{ 
          height: 'calc(100vh - 250px)', 
          minHeight: '600px',
          overflow: 'hidden', 
          position: 'relative'
        }}>
          <FormBuilderAlternative 
            ref={formBuilderRef} 
            initialForm={form}
          />
        </Paper>
      </Box>

      {/* Dialog de Preview */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Preview do Formulário: {formData.title || formData.name || 'Sem título'}
        </DialogTitle>
        <DialogContent>
            <Box sx={{ minHeight: '400px', p: 2 }}>
            {form && form.children && form.children.length > 0 ? (
              <FormViewerSimple 
                form={form} 
                formName={formData.name || 'Preview'} 
              />
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Adicione componentes ao formulário para ver o preview
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormBuilderAdvanced;