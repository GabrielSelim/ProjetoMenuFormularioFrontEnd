import React from 'react';
import {
  Paper,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { StatusSubmissao, StatusSubmissaoLabels } from '../../api/submissionService';

const SubmissionFilters = ({ 
  filters, 
  onFiltersChange, 
  forms = [],
  onClearFilters 
}) => {
  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      formId: '',
      status: '',
      search: '',
      dataInicio: '',
      dataFim: '',
      usuarioId: ''
    };
    onFiltersChange(clearedFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <FilterList sx={{ color: 'text.secondary' }} />
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ flexGrow: 1, width: '100%' }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Formulário</InputLabel>
            <Select
              value={filters.formId || ''}
              label="Formulário"
              onChange={(e) => handleFilterChange('formId', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {forms.map((form) => (
                <MenuItem key={form.id} value={form.id}>
                  {form.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(StatusSubmissaoLabels).map(([value, label]) => (
                <MenuItem key={value} value={parseInt(value)}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Buscar"
            placeholder="Nome do formulário, usuário..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />

          <TextField
            type="date"
            label="Data Inicial"
            value={filters.dataInicio || ''}
            onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            type="date"
            label="Data Final"
            value={filters.dataFim || ''}
            onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </Stack>

        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={clearAllFilters}
          sx={{ minWidth: 120 }}
        >
          Limpar
        </Button>
      </Stack>
    </Paper>
  );
};

export default SubmissionFilters;