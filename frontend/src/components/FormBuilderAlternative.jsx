import React, { useCallback, useRef, useState } from 'react';
import { 
  rSuiteComponents,
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  rtlCssLoader,
  RsLocalizationWrapper
} from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import { BiDi } from '@react-form-builder/core';
import './FormEngineComponentRegistry';
import 'rsuite/dist/rsuite.min.css';
import '../mobx-config';

const componentsMetadata = rSuiteComponents.map(definer => {
  const built = definer.build();
  return built;
}).filter(component => component && (component.type || component.model));
const builderView = new BuilderView(componentsMetadata)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

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
    
    if (initialFormData) {
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
      return jsonString;
    }
    
    return JSON.stringify(emptyForm);
  };
};

const FormBuilderAlternative = React.forwardRef(({ initialForm }, ref) => {
  const builderRef = useRef();

  React.useEffect(() => {
  }, [initialForm]);

  const setBuilderRef = useCallback((builder) => {
    if (builder) {
      builderRef.current = builder;
      
    }
  }, []);

  React.useImperativeHandle(ref, () => ({
    getCurrentForm: () => {
      
      if (builderRef.current) {
        try {
          const formData = builderRef.current.formAsString;
          
          if (typeof formData === 'object' && formData !== null) {
            const form = formData.form || formData;
            return form;
          }
          
          if (typeof formData === 'string') {
            const parsed = JSON.parse(formData);
            const form = parsed.form || parsed;
            return form;
          }
        } catch (e) {
          console.error('Error getting current form:', e);
        }
      }
      
      return null;
    }
  }), []);

  const getFormFn = React.useMemo(() => createGetFormFn(initialForm), [initialForm]);

  const customValidators = {};
  const customActions = {};

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px' }}>
      <FormBuilder
        key={initialForm ? `form-${initialForm.key || 'loaded'}` : 'empty'}
        view={builderView}
        getForm={getFormFn}
        formName="test"
        builderRef={setBuilderRef}
        validators={customValidators}
        actions={customActions}
      />
    </div>
  );
});

export default FormBuilderAlternative;
