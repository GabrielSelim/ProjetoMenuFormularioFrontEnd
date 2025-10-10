import React, { useCallback, useRef, useState } from 'react';
import { rSuiteComponents } from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import 'rsuite/dist/rsuite.min.css';

// Versão que mantém track do estado do formulário internamente
const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata);

// Formulário inicial
const emptyForm = {
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
    "code": "en",
    "dialect": "US",
    "name": "English",
    "description": "American English",
    "bidi": "ltr"
  }],
  "defaultLanguage": "en-US"
};

const createGetFormFn = (initialFormData) => {
  return async function getFormFn(name) {
    console.log('=== createGetFormFn called ===');
    console.log('name:', name);
    console.log('initialFormData:', initialFormData);
    
    if (initialFormData) {
      console.log('Há initialFormData, criando fullForm...');
      const fullForm = {
        "version": "1",
        "tooltipType": "RsTooltip",
        "errorType": "RsErrorMessage",
        "form": initialFormData,
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
      const jsonString = JSON.stringify(fullForm);
      console.log('Retornando fullForm JSON (primeiros 200 chars):', jsonString.substring(0, 200));
      return jsonString;
    }
    
    console.log('Sem initialFormData, retornando emptyForm');
    return JSON.stringify(emptyForm);
  };
};

const FormBuilderAlternative = React.forwardRef(({ initialForm }, ref) => {
  const builderRef = useRef();

  // Log para debug quando initialForm mudar
  React.useEffect(() => {
    console.log('=== FormBuilderAlternative useEffect ===');
    console.log('initialForm recebido:', initialForm);
  }, [initialForm]);

  const setBuilderRef = useCallback((builder) => {
    if (builder) {
      builderRef.current = builder;
      console.log('Builder ref set:', builderRef.current);
      
      // Não usar captura periódica para evitar conflitos
    }
  }, []);

  React.useImperativeHandle(ref, () => ({
    getCurrentForm: () => {
      console.log('=== FormBuilderAlternative getCurrentForm ===');
      
      // Tentar obter sempre do builderRef atual
      if (builderRef.current) {
        try {
          const formData = builderRef.current.formAsString;
          console.log('formData type:', typeof formData);
          
          if (typeof formData === 'object' && formData !== null) {
            const form = formData.form || formData;
            console.log('Returning form from object formAsString:', form);
            return form;
          }
          
          if (typeof formData === 'string') {
            const parsed = JSON.parse(formData);
            const form = parsed.form || parsed;
            console.log('Returning form from string formAsString:', form);
            return form;
          }
        } catch (e) {
          console.error('Error getting current form:', e);
        }
      }
      
      console.log('No form found, returning null');
      return null;
    }
  }), []);

  const getFormFn = React.useMemo(() => createGetFormFn(initialForm), [initialForm]);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px' }}>
      <FormBuilder
        key={initialForm ? `form-${initialForm.key || 'loaded'}` : 'empty'}
        view={builderView}
        getForm={getFormFn}
        formName="test"
        builderRef={setBuilderRef}
      />
    </div>
  );
});

export default FormBuilderAlternative;