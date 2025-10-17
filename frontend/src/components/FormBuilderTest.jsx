import React, { useCallback, useRef } from 'react';
import { rSuiteComponents } from '@react-form-builder/components-rsuite';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import 'rsuite/dist/rsuite.min.css';

const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata);

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
  return JSON.stringify(emptyForm);
}

const FormBuilderTest = React.forwardRef((props, ref) => {
  const builderRef = useRef();

  const setBuilderRef = useCallback((builder) => {
    if (builder) {
      builderRef.current = builder;
    }
  }, []);

  React.useImperativeHandle(ref, () => ({
    getCurrentForm: () => {
      if (builderRef.current) {
        try {
          
          let formData = builderRef.current.formAsString;
          
          if (typeof formData === 'object' && formData !== null) {
            if (formData.form) {
              return formData.form;
            }
            if (formData.children) {
              return formData;
            }
            return null;
          }
          
          if (typeof formData === 'string') {
            const parsed = JSON.parse(formData);
            return parsed.form || parsed;
          }
                   
          return null;
        } catch (e) {
          return null;
        }
      }
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
