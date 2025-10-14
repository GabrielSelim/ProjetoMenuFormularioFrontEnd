# 🎨 IMPLEMENTAÇÃO FRONTEND - SISTEMA DE SUBMISSIONS

## 🎯 OBJETIVO
Criar interface React completa para gerenciar submissions de formulários com listagem, edição, aprovação e relatórios.

## 📁 ESTRUTURA DE ARQUIVOS
```
src/
├── pages/
│   ├── submissions/
│   │   ├── SubmissionsList.jsx      # Lista de submissions
│   │   ├── SubmissionView.jsx       # Visualizar submission
│   │   └── SubmissionEdit.jsx       # Editar submission
├── components/
│   ├── submissions/
│   │   ├── SubmissionCard.jsx       # Card de submission
│   │   ├── SubmissionFilters.jsx    # Filtros de busca
│   │   └── SubmissionStatus.jsx     # Badge de status
├── services/
│   └── submissionService.js         # API calls
└── hooks/
    └── useSubmissions.js            # Hook personalizado
```

## 📋 TELA PRINCIPAL: SubmissionsList.jsx
```jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton,
  Pagination, TextField, Select, MenuItem, FormControl,
  InputLabel, Stack, Alert
} from '@mui/material';
import {
  Visibility, Edit, Delete, Add, FilterList
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submissionService } from '../services/submissionService';
import SubmissionStatus from '../components/submissions/SubmissionStatus';

const SubmissionsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    formId: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [forms, setForms] = useState([]); // Para dropdown de filtro

  // Carregar dados
  useEffect(() => {
    loadSubmissions();
    loadForms();
  }, [filters, page]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await submissionService.getAll({
        ...filters,
        page,
        pageSize: 10
      });
      setSubmissions(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadForms = async () => {
    try {
      const response = await fetch('/api/forms');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta submission?')) {
      try {
        await submissionService.delete(id);
        loadSubmissions(); // Recarregar lista
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir submission');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'approved') {
        await submissionService.approve(id, { comments: 'Aprovado via interface' });
      } else if (newStatus === 'rejected') {
        const reason = prompt('Motivo da rejeição:');
        if (reason) {
          await submissionService.reject(id, { reason });
        }
      } else {
        await submissionService.updateStatus(id, newStatus);
      }
      loadSubmissions(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      submitted: 'primary',
      underReview: 'warning',
      approved: 'success',
      rejected: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Rascunho',
      submitted: 'Enviado',
      underReview: 'Em Análise',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">📋 Minhas Submissions</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/forms')}
        >
          Nova Submission
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          <FilterList sx={{ mr: 1 }} />
          Filtros
        </Typography>
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Filtro por Formulário */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Formulário</InputLabel>
            <Select
              value={filters.formId}
              label="Formulário"
              onChange={(e) => setFilters({ ...filters, formId: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {forms.map((form) => (
                <MenuItem key={form.id} value={form.id}>
                  {form.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro por Status */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="draft">Rascunho</MenuItem>
              <MenuItem value="submitted">Enviado</MenuItem>
              <MenuItem value="underReview">Em Análise</MenuItem>
              <MenuItem value="approved">Aprovado</MenuItem>
              <MenuItem value="rejected">Rejeitado</MenuItem>
            </Select>
          </FormControl>

          {/* Busca */}
          <TextField
            label="Buscar"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ flexGrow: 1 }}
          />

          {/* Data Inicial */}
          <TextField
            type="date"
            label="Data Inicial"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          {/* Data Final */}
          <TextField
            type="date"
            label="Data Final"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>

      {/* Tabela de Submissions */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Formulário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data Criação</TableCell>
              <TableCell>Última Atualização</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Alert severity="info">Nenhuma submission encontrada</Alert>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.id}</TableCell>
                  
                  <TableCell>
                    <Typography variant="subtitle2">
                      {submission.formName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Por: {submission.userName}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusLabel(submission.status)}
                      color={getStatusColor(submission.status)}
                      size="small"
                      onClick={() => {
                        if (user?.role === 'admin' || user?.role === 'manager') {
                          const newStatus = prompt('Novo status (draft, submitted, approved, rejected):');
                          if (newStatus) {
                            handleStatusChange(submission.id, newStatus);
                          }
                        }
                      }}
                      style={{ 
                        cursor: (user?.role === 'admin' || user?.role === 'manager') ? 'pointer' : 'default'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    {new Date(submission.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(submission.updatedAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => navigate(`/submissions/${submission.id}/view`)}
                      title="Visualizar"
                    >
                      <Visibility />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => navigate(`/submissions/${submission.id}/edit`)}
                      disabled={submission.status === 'approved'}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => handleDelete(submission.id)}
                      disabled={submission.status === 'underReview' || submission.status === 'approved'}
                      color="error"
                      title="Excluir"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default SubmissionsList;
```

## 👁️ TELA DE VISUALIZAÇÃO: SubmissionView.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent,
  Chip, Divider, List, ListItem, ListItemText
} from '@mui/material';
import { ArrowBack, Edit, Print } from '@mui/icons-material';
import FormRenderer from '../components/FormRenderer';
import { submissionService } from '../services/submissionService';

const SubmissionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmission();
    loadHistory();
  }, [id]);

  const loadSubmission = async () => {
    try {
      const data = await submissionService.getById(id);
      setSubmission(data);
    } catch (error) {
      console.error('Erro ao carregar submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await submissionService.getHistory(id);
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!submission) return <div>Submission não encontrada</div>;

  const formData = JSON.parse(submission.dataJson);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/submissions')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          📋 {submission.formName}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => navigate(`/submissions/${id}/edit`)}
          disabled={submission.status === 'approved'}
          sx={{ mr: 1 }}
        >
          Editar
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Imprimir
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Dados do Formulário */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📝 Dados Preenchidos
            </Typography>
            
            {/* Renderizar dados do formulário */}
            <Box sx={{ mt: 2 }}>
              {Object.entries(formData).map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Informações Laterais */}
        <Grid item xs={12} md={4}>
          {/* Status e Informações */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ℹ️ Informações
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip 
                  label={submission.status}
                  color={submission.status === 'approved' ? 'success' : 'primary'}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Criado em:
                </Typography>
                <Typography variant="body1">
                  {new Date(submission.createdAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Atualizado em:
                </Typography>
                <Typography variant="body1">
                  {new Date(submission.updatedAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
              
              {submission.submittedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Submetido em:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(submission.submittedAt).toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              )}
              
              {submission.approvedAt && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Aprovado em:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(submission.approvedAt).toLocaleString('pt-BR')}
                  </Typography>
                  {submission.approvedByUserName && (
                    <Typography variant="body2" color="text.secondary">
                      Por: {submission.approvedByUserName}
                    </Typography>
                  )}
                </Box>
              )}
              
              {submission.rejectionReason && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="error">
                    Motivo da Rejeição:
                  </Typography>
                  <Typography variant="body1">
                    {submission.rejectionReason}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Histórico */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📜 Histórico
              </Typography>
              
              <List dense>
                {history.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${item.action} - ${item.userName}`}
                      secondary={new Date(item.createdAt).toLocaleString('pt-BR')}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubmissionView;
```

## ✏️ TELA DE EDIÇÃO: SubmissionEdit.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Save, ArrowBack, AutoSave } from '@mui/icons-material';
import FormRenderer from '../components/FormRenderer';
import { submissionService } from '../services/submissionService';

const SubmissionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    loadSubmission();
  }, [id]);

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (hasChanges) {
      const timer = setTimeout(() => {
        autoSave();
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, hasChanges]);

  const loadSubmission = async () => {
    try {
      const data = await submissionService.getById(id);
      setSubmission(data);
      setFormData(JSON.parse(data.dataJson));
    } catch (error) {
      console.error('Erro ao carregar submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    try {
      await submissionService.update(id, {
        dataJson: JSON.stringify(formData),
        status: 'draft'
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Auto-save falhou:', error);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await submissionService.update(id, {
        dataJson: JSON.stringify(formData),
        status: 'submitted'
      });
      
      navigate('/submissions', {
        state: { message: 'Submission atualizada com sucesso!' }
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar submission');
    } finally {
      setSaving(false);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData(newData);
    setHasChanges(true);
  };

  if (loading) return <div>Carregando...</div>;
  if (!submission) return <div>Submission não encontrada</div>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => {
            if (hasChanges) {
              setConfirmDialog(true);
            } else {
              navigate('/submissions');
            }
          }}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          ✏️ Editando: {submission.formName}
        </Typography>
        
        {hasChanges && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AutoSave sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Auto-save ativo
            </Typography>
          </Box>
        )}
        
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit}
          disabled={saving || !hasChanges}
        >
          {saving ? 'Salvando...' : 'Salvar e Submeter'}
        </Button>
      </Box>

      {/* Alertas */}
      {hasChanges && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Você tem alterações não salvas. Elas serão salvas automaticamente em breve.
        </Alert>
      )}

      {/* Formulário */}
      <Paper sx={{ p: 3 }}>
        {/* Aqui você integraria com o FormEngine.io */}
        <Typography variant="h6" gutterBottom>
          📝 Dados do Formulário
        </Typography>
        
        {/* Exemplo simples - substitua pela integração do FormEngine.io */}
        <Box sx={{ mt: 2 }}>
          {Object.entries(formData).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{key}:</Typography>
              <input
                type="text"
                value={String(value)}
                onChange={(e) => handleFormDataChange({
                  ...formData,
                  [key]: e.target.value
                })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Descartar Alterações?</DialogTitle>
        <DialogContent>
          Você tem alterações não salvas. Deseja realmente sair sem salvar?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={() => navigate('/submissions')} color="error">
            Descartar e Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmissionEdit;
```

## 🔧 SERVICE: submissionService.js
```javascript
import api from './api'; // Seu axios configurado

export const submissionService = {
  // Listar submissions com filtros
  async getAll(params = {}) {
    const response = await api.get('/formsubmissions', { params });
    return response.data;
  },

  // Buscar submission específica
  async getById(id) {
    const response = await api.get(`/formsubmissions/${id}`);
    return response.data;
  },

  // Criar nova submission
  async create(data) {
    const response = await api.post('/formsubmissions', data);
    return response.data;
  },

  // Atualizar submission
  async update(id, data) {
    const response = await api.put(`/formsubmissions/${id}`, data);
    return response.data;
  },

  // Excluir submission
  async delete(id) {
    await api.delete(`/formsubmissions/${id}`);
  },

  // Submeter para aprovação
  async submit(id) {
    await api.post(`/formsubmissions/${id}/submit`);
  },

  // Aprovar submission (Admin/Manager)
  async approve(id, data) {
    await api.post(`/formsubmissions/${id}/approve`, data);
  },

  // Rejeitar submission (Admin/Manager)
  async reject(id, data) {
    await api.post(`/formsubmissions/${id}/reject`, data);
  },

  // Buscar histórico
  async getHistory(id) {
    const response = await api.get(`/formsubmissions/${id}/history`);
    return response.data;
  }
};
```

## 🗂️ ROTAS: App.jsx
```jsx
// Adicionar essas rotas no seu sistema existente
import SubmissionsList from './pages/submissions/SubmissionsList';
import SubmissionView from './pages/submissions/SubmissionView';
import SubmissionEdit from './pages/submissions/SubmissionEdit';

// Dentro das suas rotas:
<Route path="/submissions" element={<SubmissionsList />} />
<Route path="/submissions/:id/view" element={<SubmissionView />} />
<Route path="/submissions/:id/edit" element={<SubmissionEdit />} />
```

## 📱 MENU: Sidebar.jsx
```jsx
// Adicionar este item no menu lateral existente
{
  name: 'Minhas Submissions',
  icon: 'assignment',
  path: '/submissions',
  roles: ['user', 'admin', 'manager']
}
```

## 🎯 INTEGRAÇÃO COM FORMENGINE.IO

Para integrar com o FormEngine.io existente, substitua os campos simples de edição por:

```jsx
import FormEngine from '@react-form-builder/core';

// No SubmissionEdit.jsx, substitua o formulário simples por:
<FormEngine
  schema={JSON.parse(submission.form.schemaJson)}
  data={formData}
  onChange={handleFormDataChange}
  readOnly={false}
/>

// No SubmissionView.jsx:
<FormEngine
  schema={JSON.parse(submission.form.schemaJson)}
  data={formData}
  readOnly={true}
/>
```

## ✅ RESULTADO ESPERADO

Com essa implementação você terá:

✅ **Lista completa** de submissions com filtros e paginação  
✅ **Visualização detalhada** com histórico  
✅ **Edição** com auto-save e integração FormEngine.io  
✅ **Workflow de aprovação** para Admin/Manager  
✅ **Interface responsiva** Material-UI  
✅ **Navegação intuitiva** integrada ao sistema atual  

O sistema permitirá que usuários gerenciem completamente suas submissions de formulários!