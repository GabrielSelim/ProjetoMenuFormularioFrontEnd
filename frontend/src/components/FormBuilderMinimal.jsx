import React, { useCallback, useState } from 'react';
import { rSuiteComponents } from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import 'rsuite/dist/rsuite.min.css';
import '../mobx-config';

// Configuração mais simples para teste
const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata);

// Formulário inicial seguindo exatamente a documentação
const initialForm = {
  "version": "1",
  "tooltipType": "RsTooltip",
  "errorType": "RsErrorMessage",
  "form": {
    "key": "Screen",
    "type": "Screen", 
    "props": {},
    "children": []
  },
  "localization": {},
  "languages": [{
    "code": "pt",
    "dialect": "BR", 
    "name": "Português",
    "description": "Português do Brasil",
    "bidi": "ltr"
  }],
  "defaultLanguage": "pt-BR"
};

const FormBuilderMinimal = ({ onFormChange }) => {
  const [formData, setFormData] = useState(initialForm);

  // Função getForm assíncrona - deve retornar STRING JSON
  const getFormFn = useCallback(async (name) => {
    console.log('getFormFn called with:', name);
    console.log('returning JSON string of formData');
    return JSON.stringify(formData);
  }, [formData]);

  // Handler para mudanças no formulário
  const handleFormChange = useCallback((newFormData) => {
    console.log('Form changed:', newFormData);
    if (newFormData) {
      setFormData(newFormData);
      if (onFormChange) {
        onFormChange({ form: newFormData });
      }
    }
  }, [onFormChange]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      minHeight: '600px',
      border: '1px solid #ddd'
    }}>
      <FormBuilder
        view={builderView}
        getForm={getFormFn}
        formName="test-form"
        onFormChange={handleFormChange}
      />
    </div>
  );
};

export default FormBuilderMinimal;