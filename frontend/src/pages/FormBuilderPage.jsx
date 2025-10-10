import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Container
} from '@mui/material';
import {
  Add,
  Delete,
  Preview,
  Save,
  DragIndicator
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formService } from '../api/formService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormRenderer from '../components/FormRenderer';

const FormBuilderPage = () => {
  const [formSchema, setFormSchema] = useState({
    title: '',
    description: '',
    fields: []
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    helperText: '',
    options: [],
    width: 'full'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Senha' },
    { value: 'number', label: 'Número' },
    { value: 'select', label: 'Seleção' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'date', label: 'Data' },
    { value: 'section', label: 'Seção' }
  ];

  const handleAddField = () => {
    setEditingField(null);
    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      helperText: '',
      options: [],
      width: 'full'
    });
    setFieldDialogOpen(true);
  };

  const handleEditField = (field, index) => {
    setEditingField(index);
    setNewField({
      ...field,
      options: field.options || []
    });
    setFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!newField.name || !newField.label) {
      setError('Nome e rótulo são obrigatórios');
      return;
    }

    const fieldData = {
      ...newField,
      name: newField.name.replace(/\s+/g, '_').toLowerCase()
    };

    if (editingField !== null) {
      // Editando campo existente
      const updatedFields = [...formSchema.fields];
      updatedFields[editingField] = fieldData;
      setFormSchema({ ...formSchema, fields: updatedFields });
    } else {
      // Adicionando novo campo
      setFormSchema({
        ...formSchema,
        fields: [...formSchema.fields, fieldData]
      });
    }

    setFieldDialogOpen(false);
    setError('');
  };

  const handleDeleteField = (index) => {
    const updatedFields = formSchema.fields.filter((_, i) => i !== index);
    setFormSchema({ ...formSchema, fields: updatedFields });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formSchema.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormSchema({ ...formSchema, fields: items });
  };

  const handleSaveForm = async () => {
    try {
      if (!formSchema.title) {
        setError('Título do formulário é obrigatório');
        return;
      }

      if (formSchema.fields.length === 0) {
        setError('Adicione pelo menos um campo ao formulário');
        return;
      }

      await formService.createForm({
        name: formSchema.title,
        description: formSchema.description,
        schema: formSchema,
        isActive: true
      });

      setSuccess('Formulário salvo com sucesso!');
      setError('');
      
      // Limpar formulário após salvar
      setTimeout(() => {
        setFormSchema({
          title: '',
          description: '',
          fields: []
        });
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar formulário');
    }
  };

  const addOption = () => {
    setNewField({
      ...newField,
      options: [...(newField.options || []), { label: '', value: '' }]
    });
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...(newField.options || [])];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewField({ ...newField, options: updatedOptions });
  };

  const removeOption = (index) => {
    const updatedOptions = (newField.options || []).filter((_, i) => i !== index);
    setNewField({ ...newField, options: updatedOptions });
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
              Construtor de Formulários
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                onClick={() => setPreviewOpen(true)}
                disabled={formSchema.fields.length === 0}
              >
                Visualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveForm}
                disabled={!formSchema.title || formSchema.fields.length === 0}
              >
                Salvar Formulário
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Configurações do Formulário */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Configurações do Formulário
                </Typography>
                
                <TextField
                  fullWidth
                  label="Título do Formulário"
                  value={formSchema.title}
                  onChange={(e) => setFormSchema({ ...formSchema, title: e.target.value })}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={formSchema.description}
                  onChange={(e) => setFormSchema({ ...formSchema, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddField}
                >
                  Adicionar Campo
                </Button>
              </Paper>

              {/* Tipos de Campo Disponíveis */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tipos de Campo
                </Typography>
                <Grid container spacing={1}>
                  {fieldTypes.map(type => (
                    <Grid item xs={6} key={type.value}>
                      <Chip
                        label={type.label}
                        variant="outlined"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Lista de Campos */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Campos do Formulário ({formSchema.fields.length})
                </Typography>
                
                {formSchema.fields.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      Nenhum campo adicionado ainda. Clique em "Adicionar Campo" para começar.
                    </Typography>
                  </Box>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields">
                      {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                          {formSchema.fields.map((field, index) => (
                            <Draggable
                              key={`field-${index}`}
                              draggableId={`field-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  sx={{
                                    mb: 2,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                >
                                  <CardContent>
                                    <Box display="flex" alignItems="center" gap={2}>
                                      <IconButton
                                        size="small"
                                        {...provided.dragHandleProps}
                                      >
                                        <DragIndicator />
                                      </IconButton>
                                      
                                      <Box flexGrow={1}>
                                        <Typography variant="subtitle1">
                                          {field.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {field.type} • {field.name}
                                          {field.required && ' • Obrigatório'}
                                        </Typography>
                                      </Box>
                                      
                                      <Chip
                                        label={fieldTypes.find(t => t.value === field.type)?.label || field.type}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Box>
                                  </CardContent>
                                  
                                  <CardActions>
                                    <Button
                                      size="small"
                                      onClick={() => handleEditField(field, index)}
                                    >
                                      Editar
                                    </Button>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteField(index)}
                                      color="error"
                                    >
                                      <Delete />
                                    </IconButton>
                                  </CardActions>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Dialog para adicionar/editar campo */}
          <Dialog open={fieldDialogOpen} onClose={() => setFieldDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingField !== null ? 'Editar Campo' : 'Adicionar Campo'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Campo"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    helperText="Usado internamente (será convertido para snake_case)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rótulo"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    helperText="Texto que aparece para o usuário"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo do Campo</InputLabel>
                    <Select
                      value={newField.type}
                      label="Tipo do Campo"
                      onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                    >
                      {fieldTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Largura</InputLabel>
                    <Select
                      value={newField.width}
                      label="Largura"
                      onChange={(e) => setNewField({ ...newField, width: e.target.value })}
                    >
                      <MenuItem value="full">Largura Total</MenuItem>
                      <MenuItem value="half">Meia Largura</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Placeholder"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Texto de Ajuda"
                    value={newField.helperText}
                    onChange={(e) => setNewField({ ...newField, helperText: e.target.value })}
                  />
                </Grid>
                
                {/* Opções para select e radio */}
                {(newField.type === 'select' || newField.type === 'radio') && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Opções
                    </Typography>
                    {(newField.options || []).map((option, index) => (
                      <Box key={index} display="flex" gap={1} mb={1}>
                        <TextField
                          size="small"
                          label="Rótulo"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                        />
                        <TextField
                          size="small"
                          label="Valor"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeOption(index)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={addOption}
                    >
                      Adicionar Opção
                    </Button>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFieldDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveField} variant="contained">
                {editingField !== null ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog de Preview */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Preview do Formulário</DialogTitle>
            <DialogContent>
              <FormRenderer schema={formSchema} readOnly />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default FormBuilderPage;