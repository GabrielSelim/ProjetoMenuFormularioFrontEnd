import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Chip,
  Alert
} from '@mui/material';
import FormEngineRenderer from './FormEngineRenderer';

const FormRenderer = ({ schema, onSubmit, initialData = {}, readOnly = false }) => {
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: initialData
  });

  // Verifica se deve usar o FormEngineRenderer
  const shouldUseFormEngine = schema && 
    schema.formEngineSchema && (
      schema.formEngineSchema.form ||
      schema.formEngineSchema.components ||
      schema.formEngineSchema.fields ||
      Array.isArray(schema.formEngineSchema) ||
      schema.formEngineSchema.type
    );
  
  if (shouldUseFormEngine) {
    return (
      <FormEngineRenderer
        formSchema={schema}
        onSubmit={onSubmit}
        title={schema?.title}
        description={schema?.description}
        initialData={initialData}
        data={initialData}
      />
    );
  }

  // Se não tem fields mas tem formEngineSchema, deixa o FormEngineRenderer lidar com isso
  if (!schema.fields && schema.formEngineSchema) {
    return (
      <Alert severity="info">
        Este formulário usa FormEngine.io. Se não está aparecendo, verifique a configuração.
      </Alert>
    );
  }

  const renderField = (field) => {
    const fieldProps = {
      name: field.name,
      control,
      rules: {
        required: field.required ? `${field.label} é obrigatório` : false,
        minLength: field.minLength ? {
          value: field.minLength,
          message: `Mínimo de ${field.minLength} caracteres`
        } : undefined,
        maxLength: field.maxLength ? {
          value: field.maxLength,
          message: `Máximo de ${field.maxLength} caracteres`
        } : undefined,
        pattern: field.pattern ? {
          value: new RegExp(field.pattern),
          message: field.patternMessage || 'Formato inválido'
        } : undefined
      }
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type={field.type}
                fullWidth
                multiline={field.multiline}
                rows={field.rows || 1}
                placeholder={field.placeholder}
                helperText={fieldState.error?.message || field.helperText}
                error={!!fieldState.error}
                disabled={readOnly}
                variant="outlined"
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type="number"
                fullWidth
                placeholder={field.placeholder}
                helperText={fieldState.error?.message || field.helperText}
                error={!!fieldState.error}
                disabled={readOnly}
                variant="outlined"
                inputProps={{
                  min: field.min,
                  max: field.max,
                  step: field.step || 1
                }}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...controllerField}
                  label={field.label}
                  disabled={readOnly}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {(fieldState.error?.message || field.helperText) && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {fieldState.error?.message || field.helperText}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={controllerField.value || false}
                    disabled={readOnly}
                  />
                }
                label={field.label}
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField, fieldState }) => (
              <FormControl error={!!fieldState.error}>
                <FormLabel component="legend">{field.label}</FormLabel>
                <RadioGroup
                  {...controllerField}
                  row={field.inline}
                >
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio disabled={readOnly} />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
                {fieldState.error?.message && (
                  <Typography variant="caption" color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            {...fieldProps}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText={fieldState.error?.message || field.helperText}
                error={!!fieldState.error}
                disabled={readOnly}
              />
            )}
          />
        );

      case 'section':
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {field.label}
            </Typography>
            {field.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {field.description}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Alert severity="warning">
            Tipo de campo não suportado: {field.type}
          </Alert>
        );
    }
  };

  const onFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {schema.title && (
        <Typography variant="h4" gutterBottom>
          {schema.title}
        </Typography>
      )}
      
      {schema.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {schema.description}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          {schema.fields.map((field, index) => (
            <Grid 
              item 
              xs={12} 
              sm={field.width === 'half' ? 6 : 12}
              key={field.name || index}
            >
              {renderField(field)}
            </Grid>
          ))}
        </Grid>

        {!readOnly && onSubmit && (
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large">
              {schema.submitText || 'Enviar'}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FormRenderer;