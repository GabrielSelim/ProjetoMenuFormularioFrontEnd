// Polyfills básicos para FormEngine.io
if (typeof window !== 'undefined') {
  if (!window.global) {
    window.global = window;
  }
  if (!window.process) {
    window.process = { env: {} };
  }
}

export default {};