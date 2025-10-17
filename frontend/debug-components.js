import { rSuiteComponents } from '@react-form-builder/components-rsuite';

console.log('=== Componentes RSuite Disponíveis ===');
const componentsMetadata = rSuiteComponents.map(definer => definer.build());

componentsMetadata.forEach((component, index) => {
  console.log(`${index + 1}. ${component.model.type}`);
  console.log('   Properties:', Object.keys(component.model.properties || {}));
  console.log('   Schema:', component.model.schema ? 'Sim' : 'Não');
  console.log('---');
});

console.log('\n=== Lista de Tipos de Componentes ===');
const types = componentsMetadata.map(c => c.model.type).sort();
types.forEach(type => console.log(`- ${type}`));