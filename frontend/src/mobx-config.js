import { configure } from 'mobx';

// Configurar MobX para ser menos restritivo em desenvolvimento
configure({
  enforceActions: "never",
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: true
});