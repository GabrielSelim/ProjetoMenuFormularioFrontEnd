import React, { useCallback, useRef } from 'react';
import { rSuiteComponents } from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import 'rsuite/dist/rsuite.min.css';

// Versão mínima absoluta para testar
const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata);

// Formulário vazio para começar
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

async function getFormFn(name) {
  console.log('getFormFn called with:', name);
  console.log('returning JSON string of form');
  return JSON.stringify(emptyForm);
}

const FormBuilderTest = React.forwardRef((props, ref) => {
  const builderRef = useRef();

  const setBuilderRef = useCallback((builder) => {
    if (builder) {
      builderRef.current = builder;
      console.log('Builder ref set:', builderRef.current);
    }
  }, []);

  // Expor função para pegar o formulário atual
  React.useImperativeHandle(ref, () => ({
    getCurrentForm: () => {
      if (builderRef.current) {
        try {
          console.log('=== getCurrentForm DEBUG ===');
          
          // Primeiro, tentar acessar formAsString
          let formData = builderRef.current.formAsString;
          console.log('formAsString type:', typeof formData);
          
          // Se formAsString retornar um objeto, tratar como tal
          if (typeof formData === 'object' && formData !== null) {
            console.log('formAsString returned object, using directly');
            // Se já é um objeto com a estrutura correta
            if (formData.form) {
              return formData.form;
            }
            // Se é o próprio form
            if (formData.children) {
              return formData;
            }
            return null;
          }
          
          // Se for string, fazer parse
          if (typeof formData === 'string') {
            console.log('formAsString returned string, parsing...');
            const parsed = JSON.parse(formData);
            return parsed.form || parsed;
          }
          
          // Fallback: tentar outras propriedades do builder
          console.log('Trying alternative methods...');
          console.log('Available properties:', Object.keys(builderRef.current));
          
          return null;
        } catch (e) {
          console.error('Error getting current form:', e);
          return null;
        }
      }
      console.error('builderRef.current is null');
      return null;
    }
  }), []);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px' }}>
      <FormBuilder
        view={builderView}
        getForm={getFormFn}
        formName="test"
        builderRef={setBuilderRef}
      />
    </div>
  );
});

export default FormBuilderTest;