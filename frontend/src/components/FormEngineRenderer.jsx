import React, { useCallback, useState, useEffect } from 'react';
import { FormViewer, createView, BiDi } from '@react-form-builder/core';
import { 
  rSuiteComponents,
  RsLocalizationWrapper,
  ltrCssLoader,
  rtlCssLoader,
  formEngineRsuiteCssLoader
} from '@react-form-builder/components-rsuite';
import { Box, Typography, Alert, Button, TextField } from '@mui/material';
import 'rsuite/dist/rsuite.min.css';
import '../styles/formengine-custom.css';
import '../mobx-config';

const FormEngineRenderer = ({ formSchema, onSubmit, title, description, initialData = {}, data = {}, onChange }) => {
  
  const [formData, setFormData] = useState(() => {
    // Prioriza data, depois initialData, depois objeto vazio
    return { ...initialData, ...data };
  });

  // Atualiza os dados quando as props mudarem
  useEffect(() => {
    const newData = { ...initialData, ...data };
    setFormData(newData);
  }, [initialData, data]);

  // Verifica se é um schema do FormEngine.io (mais flexível)
  const isFormEngineSchema = formSchema && 
    formSchema.formEngineSchema && (
      formSchema.formEngineSchema.form ||
      formSchema.formEngineSchema.components ||
      formSchema.formEngineSchema.fields ||
      Array.isArray(formSchema.formEngineSchema) ||
      formSchema.formEngineSchema.type
    );


  // Temporariamente desabilitando FormEngine para debug
  // Se não for schema do FormEngine, retorna null para usar o renderer padrão
  if (!isFormEngineSchema) {
    return null;
  }

  // Criar um renderer personalizado baseado no schema do FormEngine
  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Função para extrair valores das props que podem vir como {value: "texto"} ou "texto"
  const extractValue = (prop) => {
    if (!prop) return '';
    if (typeof prop === 'string') return prop;
    if (typeof prop === 'object' && prop.value !== undefined) return prop.value;
    return prop;
  };

  const handleInputChange = (key, value) => {
    const newData = {
      ...formData,
      [key]: value
    };
    setFormData(newData);
    
    // Chama onChange se fornecido (para o auto-save)
    if (onChange) {
      onChange(newData);
    }
  };

  const renderFormComponent = (component) => {
    const { key, type, props = {} } = component;
    
    
    switch (type) {
      case 'RsInput':
        const isTextarea = extractValue(props.as) === 'textarea';
        const label = extractValue(props.label) || extractValue(props.name) || `Campo ${key}`;
        const placeholder = extractValue(props.placeholder) || `Digite aqui...`;
        const rows = parseInt(extractValue(props.rows)) || (isTextarea ? 4 : 1);
        
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="body2" component="label" sx={{ 
              display: 'block', 
              mb: 1, 
              fontWeight: 500 
            }}>
              {label}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={placeholder}
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              required={extractValue(props.required) || false}
              type={extractValue(props.inputType) || 'text'}
              multiline={isTextarea}
              rows={isTextarea ? rows : undefined}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        );

      case 'RsTextarea':
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="body2" component="label" sx={{ 
              display: 'block', 
              mb: 1, 
              fontWeight: 500 
            }}>
              {extractValue(props.label) || extractValue(props.name) || `Área de Texto ${key}`}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={extractValue(props.placeholder) || `Digite aqui...`}
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              required={extractValue(props.required) || false}
              multiline
              rows={parseInt(extractValue(props.rows)) || 4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        );

      case 'RsSelect':
      case 'RsSelectPicker':
        const options = extractValue(props.options) || extractValue(props.data) || [];
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="body2" component="label" sx={{ 
              display: 'block', 
              mb: 1, 
              fontWeight: 500 
            }}>
              {extractValue(props.label) || extractValue(props.name) || `Seleção ${key}`}
            </Typography>
            <TextField
              fullWidth
              select
              variant="outlined"
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              required={extractValue(props.required) || false}
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            >
              <option value="">Selecione uma opção</option>
              {options.map((option, index) => (
                <option key={index} value={extractValue(option.value) || extractValue(option)}>
                  {extractValue(option.label) || extractValue(option.text) || extractValue(option)}
                </option>
              ))}
            </TextField>
          </Box>
        );

      case 'RsCheckbox':
        const checkboxLabel = extractValue(props.children) || 
                             extractValue(props.label) || 
                             extractValue(props.name) || 
                             `Checkbox ${key}`;
        
        return (
          <Box key={key} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id={key}
                checked={formData[key] || false}
                onChange={(e) => handleInputChange(key, e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <Typography variant="body2" component="label" htmlFor={key}>
                {checkboxLabel}
              </Typography>
            </Box>
          </Box>
        );

      case 'RsRadio':
      case 'RsRadioGroup':
        const radioOptions = extractValue(props.options) || extractValue(props.data) || [];
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="body2" component="legend" sx={{ 
              display: 'block', 
              mb: 1, 
              fontWeight: 500 
            }}>
              {extractValue(props.label) || extractValue(props.name) || `Opção ${key}`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {radioOptions.map((option, index) => {
                const optionValue = extractValue(option.value) || extractValue(option);
                const optionLabel = extractValue(option.label) || extractValue(option.text) || extractValue(option);
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id={`${key}_${index}`}
                      name={key}
                      value={optionValue}
                      checked={formData[key] === optionValue}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body2" component="label" htmlFor={`${key}_${index}`}>
                      {optionLabel}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );

      case 'RsDatePicker':
        return (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="body2" component="label" sx={{ 
              display: 'block', 
              mb: 1, 
              fontWeight: 500 
            }}>
              {extractValue(props.label) || extractValue(props.name) || `Data ${key}`}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              required={extractValue(props.required) || false}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        );

      case 'RsButton':
        return (
          <Box key={key} sx={{ mb: 2 }}>
            <Button
              variant={extractValue(props.variant) || 'contained'}
              color={extractValue(props.color) || 'primary'}
              size={extractValue(props.size) || 'medium'}
              onClick={() => {
                const onClick = extractValue(props.onClick);
                if (onClick) onClick();
              }}
            >
              {extractValue(props.label) || extractValue(props.text) || `Botão ${key}`}
            </Button>
          </Box>
        );

      case 'Screen':
        // Container principal - renderizar apenas os filhos
        return (
          <Box key={key}>
            {component.children && component.children.map(child => 
              renderFormComponent(child)
            )}
          </Box>
        );

      case 'RsPanel':
      case 'RsForm':
        const panelTitle = extractValue(props.title);
        return (
          <Box key={key} sx={{ 
            mb: 3, 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
            {panelTitle && (
              <Typography variant="h6" gutterBottom>
                {panelTitle}
              </Typography>
            )}
            {component.children && component.children.map(child => 
              renderFormComponent(child)
            )}
          </Box>
        );
      
      default:
        return (
          <Box key={key} sx={{ mb: 2, p: 2, border: '1px dashed #orange', borderRadius: 1, bgcolor: 'warning.light' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Componente não implementado:</strong> {type}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Props: {JSON.stringify(props)}
            </Typography>
            {component.children && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Renderizando filhos:
                </Typography>
                {component.children.map(child => renderFormComponent(child))}
              </Box>
            )}
          </Box>
        );
    }
  };

  // Função para extrair a estrutura do formulário de diferentes formatos de schema
  const getFormStructure = () => {
    const schema = formSchema.formEngineSchema;
    
    // Diferentes possíveis estruturas
    if (schema.form) {
      return schema.form;
    } else if (schema.components) {
      return { children: schema.components };
    } else if (schema.fields) {
      return { children: schema.fields };
    } else if (Array.isArray(schema)) {
      return { children: schema };
    } else {
      return schema;
    }
  };

  const formStructure = getFormStructure();
  
  // Contar total de componentes (incluindo aninhados)
  const countComponents = (structure) => {
    if (!structure) return 0;
    if (structure.children && Array.isArray(structure.children)) {
      return structure.children.reduce((count, child) => {
        return count + 1 + countComponents(child);
      }, 0);
    }
    return structure.type ? 1 : 0;
  };

  const componentCount = countComponents(formStructure);
  
  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: 'primary.main',
          fontWeight: 600,
          mb: 3
        }}>
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
      )}

      <Box component="form" sx={{ 
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}>
        
        {/* Renderizar baseado na estrutura do formulário */}
        {formStructure.children && Array.isArray(formStructure.children) ? (
          formStructure.children.map(component => renderFormComponent(component))
        ) : formStructure.type ? (
          renderFormComponent(formStructure)
        ) : (
          <Alert severity="warning">
            Estrutura de formulário não reconhecida. Schema completo:
            <pre style={{ fontSize: '11px', marginTop: '8px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(formSchema.formEngineSchema, null, 2)}
            </pre>
          </Alert>
        )}

        {onSubmit && (
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => setFormData({})}
            >
              Limpar
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleFormSubmit}
              sx={{ minWidth: 120 }}
            >
              Enviar Formulário
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FormEngineRenderer;
