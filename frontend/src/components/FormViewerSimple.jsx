import React, { useCallback, useRef } from 'react';
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite';
import { ActionDefinition, BiDi, createView, FormViewer } from '@react-form-builder/core';
import './FormEngineComponentRegistry';
import 'rsuite/dist/rsuite.min.css';
import '../mobx-config';

const componentsMetadata = rSuiteComponents.map(definer => {
  const built = definer.build();
  const metadata = built.model || built;
  return metadata;
}).filter(component => component && component.type);

const view = createView(componentsMetadata)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

const customValidators = {};

const FormViewerSimple = ({ form, formName = 'Preview' }) => {
  const ref = useRef();
  
  const setRef = useCallback((viewer) => {
    if (viewer) {
      ref.current = viewer;
    }
  }, []);

  const localizeFn = useCallback((componentStore, language) => {
    return componentStore.key === 'submit' && language.code === 'pt'
      ? {'children': 'Enviar'}
      : {};
  }, []);

  const handleFormDataChange = useCallback(({ data, errors }) => {
  }, []);

  const handleError = useCallback((error) => {
  }, []);

  const getFormFn = useCallback(async (name) => {
    
    if (name === formName && form) {
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
        onError={handleError}
        viewerRef={setRef}
        validators={customValidators}
        actions={{}}
      />
    </div>
  );
};

export default FormViewerSimple;
