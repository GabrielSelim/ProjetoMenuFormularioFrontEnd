import React, { useCallback, useRef } from 'react';
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite';
import { ActionDefinition, BiDi } from '@react-form-builder/core';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';

const componentsMetadata = rSuiteComponents.map(definer => definer.build());
const builderView = new BuilderView(componentsMetadata)
  .withTemplates([])
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader);

const formStorage = undefined;

const customValidators = {
  'string': {
    'isHex': {
      validate: value => /^[0-9A-F]*$/i.test(value)
    },
    'isHappy': {
      params: [],
      validate: value => value === 'Happy'
    },
    'equals': {
      params: [
        {key: 'value', type: 'string', required: false, default: 'Ring'},
        {key: 'message', type: 'string', required: false, default: 'Value must be equals to '}
      ],
      validate: (value, _, args) => {
        const errorMessage = args?.['message'];
        const checkedValue = args?.['value'];
        const errorResult = errorMessage ? errorMessage + checkedValue : false;
        return value !== args?.['value'] ? errorResult : true;
      }
    }
  },
  'number': {},
  'boolean': {
    'onlyTrue': {
      validate: value => value === true
    }
  }
};

const emptyForm = {
  "version": "1",
  "tooltipType": "RsTooltip",
  "errorType": "RsErrorMessage",
  "form": {
    "key": "Screen",
    "type": "Screen",
    "props": {},
    "children": [
      {
        "key": "name",
        "type": "RsInput",
        "props": {
          "placeholder": {
            "value": "Enter your name"
          },
          "label": {
            "value": "Name"
          }
        },
        "schema": {
          "validations": [
            {
              "key": "required"
            }
          ]
        },
        "tooltipProps": {
          "text": {
            "value": "Name"
          }
        }
      },
      {
        "key": "password",
        "type": "RsInput",
        "props": {
          "label": {
            "value": "Password"
          },
          "passwordMask": {
            "value": true
          }
        },
        "schema": {
          "validations": [
            {
              "key": "required"
            }
          ]
        },
        "tooltipProps": {
          "text": {
            "value": "Password"
          },
          "placement": {
            "value": "left"
          }
        }
      },
      {
        "key": "submit",
        "type": "RsButton",
        "props": {
          "children": {
            "value": "Login"
          },
          "color": {
            "value": "blue"
          },
          "appearance": {
            "value": "primary"
          }
        },
        "events": {
          "onClick": [
            {
              "name": "validate",
              "type": "common"
            },
            {
              "name": "logEventArgs",
              "type": "custom"
            }
          ]
        }
      }
    ]
  },
  "localization": {},
  "languages": [
    {
      "code": "en",
      "dialect": "US",
      "name": "English",
      "description": "American English",
      "bidi": "ltr"
    }
  ],
  "defaultLanguage": "en-US"
};

const formName = 'Example';

async function getFormFn(name) {
  if (name === formName) return JSON.stringify(emptyForm);
  throw new Error(`Form '${name}' is not found.`);
}

export const FormBuilderDoc = () => {
  const ref = useRef();
  
  const setRef = useCallback((viewer) => {
    if (viewer) {
      ref.current = viewer;
    }
  }, []);

  const localizeFn = useCallback((componentStore, language) => {
    return componentStore.key === 'submit' && language.code === 'en'
      ? {'children': 'Submit'}
      : {};
  }, []);

  return (
    <FormBuilder
      view={builderView}
      getForm={getFormFn}
      formName={formName}
      initialData={{}}
      formStorage={formStorage}
      localize={localizeFn}
      onFormDataChange={({ data, errors }) => {
      }}
      viewerRef={setRef}
      validators={customValidators}
      actions={{
        assertArgs: ActionDefinition.functionalAction((e, args) => {
        }, {
          p1: 'string',
          p2: 'boolean',
          p3: 'number'
        })
      }}
    />
  );
};

export default FormBuilderDoc;
