import React, { useCallback } from 'react';
import { FormViewer, createView, BiDi } from '@react-form-builder/core';
import { 
  rSuiteComponents,
  RsLocalizationWrapper,
  ltrCssLoader,
  rtlCssLoader,
  formEngineRsuiteCssLoader
} from '@react-form-builder/components-rsuite';
import { Box, Typography, Alert } from '@mui/material';
import 'rsuite/dist/rsuite.min.css';
import '../styles/formengine-custom.css';
import '../mobx-config';

// Configuração do viewer igual ao FormViewerSimple
const componentsMetadata = rSuiteComponents.map(definer => definer.build().model);
const view = createView(componentsMetadata)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

const FormEngineRenderer = ({ formSchema, onSubmit, title, description }) => {
  // Verifica se é um schema do FormEngine.io
  const isFormEngineSchema = formSchema && 
    formSchema.formEngineSchema && 
    formSchema.formEngineSchema.form;

  // Se não for schema do FormEngine, retorna null para usar o renderer padrão
  if (!isFormEngineSchema) {
    return null;
  }

  const handleFormSubmit = (formData) => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Função para obter o form com a estrutura completa necessária
  const getFormFn = useCallback(async (name) => {
    try {
      console.log('FormEngineRenderer getFormFn called with:', name);
      const formEngineData = formSchema.formEngineSchema;
      
      let formData;
      if (typeof formEngineData === 'string') {
        formData = JSON.parse(formEngineData);
      } else {
        formData = formEngineData;
      }
      
      // Criar estrutura completa se necessário
      const fullForm = {
        "version": "1",
        "tooltipType": "RsTooltip",
        "errorType": "RsErrorMessage",
        "form": formData.form || formData,
        "localization": formData.localization || {},
        "languages": formData.languages || [{
          "code": "pt",
          "dialect": "BR",
          "name": "Português",
          "description": "Português do Brasil",
          "bidi": "ltr"
        }],
        "defaultLanguage": formData.defaultLanguage || "pt-BR"
      };
      
      console.log('FormEngineRenderer returning JSON string');
      return JSON.stringify(fullForm);
    } catch (error) {
      console.error('Erro ao processar schema do FormEngine:', error);
      throw new Error('Erro ao processar schema do formulário');
    }
  }, [formSchema]);

  try {
    return (
      <Box sx={{ width: '100%' }}>
        {title && (
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}

        <Box sx={{ 
          '& .rs-form': { 
            width: '100%' 
          },
          '& .rs-form-group': {
            marginBottom: '16px'
          },
          '& .rs-form-control-label': {
            fontWeight: 500,
            marginBottom: '8px',
            display: 'block'
          },
          '& .rs-input': {
            width: '100%'
          },
          '& .rs-picker': {
            width: '100%'
          },
          '& .rs-btn': {
            borderRadius: '8px'
          }
        }}>
          <FormViewer
            view={view}
            getForm={getFormFn}
            formName="rendered-form"
            initialData={{}}
            onFormDataChange={({ data, errors }) => {
              console.log('Form data changed:', { data, errors });
            }}
          />
        </Box>
      </Box>
    );
  } catch (error) {
    console.error('Erro ao renderizar formulário com FormEngine:', error);
    return (
      <Alert severity="error">
        Erro ao carregar o formulário. Verifique se o schema está correto.
      </Alert>
    );
  }
};

export default FormEngineRenderer;