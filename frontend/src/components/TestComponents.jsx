import React from 'react';
import { rSuiteComponents } from '@react-form-builder/components-rsuite';

// Log para descobrir os componentes disponíveis
const componentsMetadata = rSuiteComponents.map(definer => {
  const component = definer.build();
  return component.model.type;
});

const TestComponents = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Componentes RSuite Disponíveis:</h2>
      <ul>
        {componentsMetadata.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestComponents;
