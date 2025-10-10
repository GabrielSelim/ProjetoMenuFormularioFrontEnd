import React, { useCallback, useRef } from 'react';
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite';
import { ActionDefinition, BiDi, createView, FormViewer } from '@react-form-builder/core';
import 'rsuite/dist/rsuite.min.css';
import '../mobx-config';

// Configuração do viewer seguindo a documentação
const componentsMetadata = rSuiteComponents.map(definer => definer.build().model);

const view = createView(componentsMetadata)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

// Custom validators simplificados
const customValidators = {};

const FormViewerSimple = ({ form, formName = 'Preview' }) => {
  const ref = useRef();
  
  const setRef = useCallback((viewer) => {
    if (viewer) {
      ref.current = viewer;
      console.log('FormViewer ref set:', ref.current);
    }
  }, []);

  const localizeFn = useCallback((componentStore, language) => {
    return componentStore.key === 'submit' && language.code === 'pt'
      ? {'children': 'Enviar'}
      : {};
  }, []);

  const handleFormDataChange = useCallback(({ data, errors }) => {
    console.log('Form data changed in viewer:', { data, errors });
  }, []);

  const getFormFn = useCallback(async (name) => {
    console.log('=== VIEWER getFormFn DEBUG ===');
    console.log('name:', name);
    console.log('formName:', formName);
    console.log('form received:', form);
    console.log('form type:', typeof form);
    console.log('=============================');
    
    if (name === formName && form) {
      // O FormViewer também precisa de uma string JSON completa
      const fullForm = {
        "version": "1",
        "tooltipType": "RsTooltip",
        "errorType": "RsErrorMessage",
        "form": form,
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
      console.log('Returning JSON string for viewer (first 200 chars):', jsonString.substring(0, 200));
      return jsonString;
    }
    throw new Error(`Form '${name}' not found.`);
  }, [form, formName]);

  if (!form) {
    return <div>Nenhum formulário para preview</div>;
  }

  return (
    <div style={{ width: '100%', minHeight: '400px' }}>
      <FormViewer
        view={view}
        getForm={getFormFn}
        formName={formName}
        initialData={{}}
        localize={localizeFn}
        onFormDataChange={handleFormDataChange}
        viewerRef={setRef}
        validators={customValidators}
        actions={{
          logEventArgs: e => console.log('Form action:', e)
        }}
      />
    </div>
  );
};

export default FormViewerSimple;