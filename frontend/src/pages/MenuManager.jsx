import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Container,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DragIndicator,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMenu } from '../context/MenuContext';
import { formService } from '../api/formService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MenuManager = () => {
  const { menus, loadAllMenus, createMenu, updateMenu, deleteMenu, reorderMenus, loading } = useMenu();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [availableForms, setAvailableForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    contentType: 'route',
    urlOrPath: '',
    rolesAllowed: '',
    parentId: null,
    order: 0,
    isActive: true,
    isVisible: true,
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🚀 Inicializando MenuManager...');
        await loadAllMenus();
        await loadAvailableForms();
        console.log('✅ MenuManager inicializado com sucesso');
      } catch (err) {
        console.error('❌ Erro ao inicializar MenuManager:', err);
        setError('Erro ao carregar dados iniciais');
      }
    };

    initializeData();
  }, []);

  const loadAvailableForms = async () => {
    try {
      setLoadingForms(true);
      const forms = await formService.getForms();
      setAvailableForms(forms || []);
    } catch (err) {
      console.warn('Erro ao carregar formulários para menus:', err);
      setAvailableForms([]);
    } finally {
      setLoadingForms(false);
    }
  };

  const menuTypes = [
    { value: 'route', label: 'Rota Interna' },
    { value: 'form', label: 'Formulário' },
    { value: 'iframe', label: 'IFrame' },
    { value: 'external', label: 'Link Externo' },
    { value: 'link', label: 'Link' },
    { value: 'page', label: 'Página' }
  ];

  const availableRoles = [
    { value: 'all', label: 'Todos os Usuários', color: 'primary' },
    { value: 'admin', label: 'Administradores', color: 'error' },
    { value: 'manager', label: 'Gerentes', color: 'warning' },
    { value: 'user', label: 'Usuários', color: 'info' },
    { value: 'guest', label: 'Visitantes', color: 'default' }
  ];
  
  const availableIcons = [
    { value: 'dashboard', label: 'Dashboard', icon: '📊' },
    { value: 'description', label: 'Formulário', icon: '📝' },
    { value: 'settings', label: 'Configurações', icon: '⚙️' },
    { value: 'people', label: 'Pessoas', icon: '👥' },
    { value: 'folder', label: 'Pasta', icon: '📁' },
    { value: 'file', label: 'Arquivo', icon: '📄' },
    { value: 'link', label: 'Link', icon: '🔗' },
    { value: 'build', label: 'Construtor', icon: '🔧' },
    { value: 'contact_mail', label: 'Contato', icon: '📧' },
    { value: 'assignment', label: 'Tarefa', icon: '📋' },
    { value: 'feedback', label: 'Feedback', icon: '💬' },
    { value: 'quiz', label: 'Quiz', icon: '❓' },
    { value: 'home', label: 'Início', icon: '🏠' },
    { value: 'info', label: 'Informação', icon: 'ℹ️' },
    { value: 'help', label: 'Ajuda', icon: '❓' }
  ];

  const handleOpenDialog = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        name: menu.name || '',
        icon: menu.icon || '',
        contentType: menu.contentType || 'route',
        urlOrPath: menu.urlOrPath || '',
        rolesAllowed: menu.rolesAllowed || '',
        parentId: menu.parentId || null,
        order: menu.order || 0,
        isActive: menu.isActive !== false,
        isVisible: menu.isVisible !== false,
        description: menu.description || ''
      });
    } else {
      setEditingMenu(null);
      setFormData({
        name: '',
        icon: '',
        contentType: 'route',
        urlOrPath: '',
        rolesAllowed: 'all',
        parentId: null,
        order: menus.length + 1,
        isActive: true,
        isVisible: true,
        description: ''
      });
    }
    setDialogOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMenu(null);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name) {
        setError('Nome é obrigatório');
        return;
      }

      if ((formData.contentType === 'route' || formData.contentType === 'page') && !formData.urlOrPath) {
        setError('URL/Caminho é obrigatório para rotas e páginas');
        return;
      }

      if ((formData.contentType === 'external' || formData.contentType === 'link') && !formData.urlOrPath) {
        setError('URL é obrigatória para links externos');
        return;
      }

      if (formData.contentType === 'form' && !formData.urlOrPath) {
        setError('ID/Path do formulário é obrigatório');
        return;
      }

      if (editingMenu) {
        await updateMenu(editingMenu.id, formData);
      } else {
        await createMenu(formData);
      }

      handleCloseDialog();
      loadAllMenus(); // Recarrega a lista após salvar
    } catch (err) {
      setError(err.message || 'Erro ao salvar menu');
    }
  };

  const handleDelete = async (menuId) => {
    if (window.confirm('Tem certeza que deseja excluir este menu?')) {
      try {
        await deleteMenu(menuId);
      } catch (err) {
        setError(err.message || 'Erro ao excluir menu');
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    // Atualiza otimisticamente a UI
    const items = Array.from(menus);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      // Reordena no servidor
      await reorderMenus(items);
      
      // Recarrega os menus para garantir sincronização
      await loadAllMenus();
      
      console.log('✅ Menus reordenados e recarregados com sucesso');
    } catch (err) {
      console.error('❌ Erro ao reordenar menus:', err);
      setError(err.message || 'Erro ao reordenar menus');
      
      // Em caso de erro, recarrega os menus para restaurar a ordem original
      await loadAllMenus();
    }
  };

  const getTypeLabel = (contentType) => {
    const typeObj = menuTypes.find(t => t.value === contentType);
    return typeObj ? typeObj.label : contentType;
  };

  const getMenuDescription = (menu) => {
    if (menu.contentType === 'form') {
      const form = availableForms.find(f => f.id.toString() === menu.urlOrPath);
      if (form) {
        return form.name;
      }
      return `Formulário ${menu.urlOrPath}`;
    }
    return menu.urlOrPath || '-';
  };

  const createQuickFormMenu = () => {
    if (availableForms.length === 0) return;
    
    const firstForm = availableForms[0];
    setEditingMenu(null);
    setFormData({
      name: `Menu: ${firstForm.name}`,
      icon: 'description',
      contentType: 'form',
      urlOrPath: firstForm.id.toString(),
      rolesAllowed: 'all',
      parentId: null,
      order: menus.length + 1,
      isActive: true,
      isVisible: true,
      description: `Menu automático para o formulário: ${firstForm.name}`
    });
    setDialogOpen(true);
    setError('');
  };

  // Loading state
  if (loading && menus.length === 0) {
    return (
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '260px',
            marginTop: '64px',
          }}
        >
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Carregando menus...
            </Typography>
            <Box sx={{ mt: 2 }}>
              <div>🔄 Aguarde...</div>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

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
        <Container maxWidth="xl">
          <Box mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Gerenciamento de Menus - Sanz Tech
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Configure os menus do sistema e organize a navegação
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{ borderRadius: 2 }}
                >
                  Novo Menu
                </Button>
                {availableForms.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={createQuickFormMenu}
                    sx={{ borderRadius: 2 }}
                  >
                    Menu Rápido p/ Formulário
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 50 }}>Ordem</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>URL/Caminho</TableCell>
                    <TableCell>Permissões</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="menus">
                    {(provided) => (
                      <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                        {menus.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                              <Typography variant="body1" color="text.secondary">
                                Nenhum menu encontrado
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Clique em "Novo Menu" para criar seu primeiro menu
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          menus.map((menu, index) => (
                            <Draggable
                              key={menu.id.toString()}
                              draggableId={menu.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  sx={{
                                    backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <IconButton
                                        size="small"
                                        {...provided.dragHandleProps}
                                        sx={{ cursor: 'grab' }}
                                      >
                                        <DragIndicator fontSize="small" />
                                      </IconButton>
                                      <Typography variant="body2" fontWeight="medium">
                                        {menu.order || index + 1}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {menu.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getTypeLabel(menu.contentType)}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {getMenuDescription(menu)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    {menu.rolesAllowed ? (
                                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {menu.rolesAllowed.split(',').slice(0, 2).map(roleValue => {
                                          const role = availableRoles.find(r => r.value === roleValue.trim());
                                          return (
                                            <Chip
                                              key={roleValue.trim()}
                                              label={role?.label || roleValue.trim()}
                                              size="small"
                                              variant="outlined"
                                              color={role?.color || 'default'}
                                            />
                                          );
                                        })}
                                        {menu.rolesAllowed.split(',').length > 2 && (
                                          <Chip
                                            label={`+${menu.rolesAllowed.split(',').length - 2}`}
                                            size="small"
                                            variant="outlined"
                                          />
                                        )}
                                      </Box>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Chip
                                        label={menu.isActive !== false ? 'Ativo' : 'Inativo'}
                                        size="small"
                                        color={menu.isActive !== false ? 'success' : 'default'}
                                        variant="filled"
                                      />
                                      {menu.isVisible !== false ? <Visibility fontSize="small" color="action" /> : <VisibilityOff fontSize="small" color="action" />}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box display="flex" gap={1}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(menu)}
                                        color="primary"
                                      >
                                        <Edit fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDelete(menu.id)}
                                        color="error"
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </DragDropContext>
              </Table>
            </TableContainer>
          </Paper>

          {/* Dialog para criar/editar menu */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingMenu ? 'Editar Menu' : 'Adicionar Menu'}
            </DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                margin="dense"
                label="Nome do Menu"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Conteúdo</InputLabel>
                    <Select
                      value={formData.contentType}
                      label="Tipo de Conteúdo"
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    >
                      {menuTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ícone</InputLabel>
                    <Select
                      value={formData.icon}
                      label="Ícone"
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      renderValue={(selected) => {
                        const icon = availableIcons.find(i => i.value === selected);
                        return (
                          <Box display="flex" alignItems="center" gap={1}>
                            {icon && <span style={{ fontSize: '20px' }}>{icon.icon}</span>}
                            {icon?.label || 'Nenhum'}
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <Box display="flex" alignItems="center" gap={1}>
                          <span style={{ fontSize: '20px' }}>❌</span>
                          Nenhum
                        </Box>
                      </MenuItem>
                      {availableIcons.map(icon => (
                        <MenuItem key={icon.value} value={icon.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <span style={{ fontSize: '20px' }}>{icon.icon}</span>
                            {icon.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {/* Campo dinâmico baseado no tipo de conteúdo */}
              {formData.contentType === 'form' ? (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Selecionar Formulário</InputLabel>
                  <Select
                    value={formData.urlOrPath}
                    label="Selecionar Formulário"
                    onChange={(e) => setFormData({ ...formData, urlOrPath: e.target.value })}
                    disabled={loadingForms}
                  >
                    <MenuItem value="">
                      <em>Selecione um formulário</em>
                    </MenuItem>
                    {availableForms.map(form => (
                      <MenuItem key={form.id} value={form.id.toString()}>
                        {form.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingForms && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Carregando formulários...
                    </Typography>
                  )}
                  <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                    💡 Este menu abrirá diretamente o formulário selecionado
                  </Typography>
                </FormControl>
              ) : (
                <TextField
                  margin="dense"
                  label={
                    formData.contentType === 'route' || formData.contentType === 'page' ? 'Caminho (ex: /dashboard)' :
                    formData.contentType === 'external' || formData.contentType === 'link' ? 'URL Externa' :
                    formData.contentType === 'iframe' ? 'URL do IFrame' :
                    'URL ou Caminho'
                  }
                  fullWidth
                  variant="outlined"
                  value={formData.urlOrPath}
                  onChange={(e) => setFormData({ ...formData, urlOrPath: e.target.value })}
                  sx={{ mb: 2 }}
                  placeholder={
                    formData.contentType === 'route' ? '/dashboard' :
                    formData.contentType === 'external' ? 'https://example.com' :
                    formData.contentType === 'iframe' ? 'https://example.com/embed' :
                    ''
                  }
                />
              )}
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Roles Permitidos</InputLabel>
                <Select
                  multiple
                  value={formData.rolesAllowed ? formData.rolesAllowed.split(',').map(r => r.trim()) : []}
                  label="Roles Permitidos"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    rolesAllowed: Array.isArray(e.target.value) ? e.target.value.join(',') : e.target.value 
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const role = availableRoles.find(r => r.value === value);
                        return (
                          <Chip
                            key={value}
                            label={role?.label || value}
                            size="small"
                            color={role?.color || 'default'}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableRoles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Chip
                        label={role.label}
                        size="small"
                        color={role.color}
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                margin="dense"
                label="Ordem de Exibição"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="Descrição (opcional)"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 2 }}
                placeholder="Descrição do menu para documentação"
              />
              
              <Box display="flex" gap={2} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Ativo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Visível na Sidebar"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editingMenu ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default MenuManager;