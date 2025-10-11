import React, { useCallback, useState } from 'react';
import { 
  rSuiteComponents, 
  RsLocalizationWrapper,
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  rtlCssLoader
} from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import { BiDi } from '@react-form-builder/core';
import 'rsuite/dist/rsuite.min.css';
import '../mobx-config';

// Configuração seguindo exatamente a documentação
const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata)
  .withTemplates([])
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

const FormBuilderSimple = ({ onFormChange }) => {
  // Formulário inicial seguindo exatamente a documentação
  const [currentForm, setCurrentForm] = React.useState(() => ({
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
    "languages": [
      {
        "code": "pt",
        "dialect": "BR",
        "name": "Português",
        "description": "Português do Brasil", 
        "bidi": "ltr"
      }
    ],
    "defaultLanguage": "pt-BR"
  }));

  // A função getForm deve ser assíncrona conforme a documentação
  const getFormFn = useCallback(async (name) => {
    return currentForm;
  }, [currentForm]);

  const handleFormChange = useCallback((newForm) => {
    if (newForm) {
      setCurrentForm(newForm);
      if (onFormChange) {
        onFormChange({ form: newForm });
      }
    }
  }, [onFormChange]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      minHeight: '700px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <FormBuilder
        view={builderView}
        getForm={getFormFn}
        formName="new-form"
        initialData={{}}
        onFormChange={handleFormChange}
        onFormDataChange={({ data, errors }) => {
        }}
      />
    </div>
  );
};

export default FormBuilderSimple;
