import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    chunkSizeWarningLimit: 5000,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/formengine/, /rsuite/, /node_modules/]
    },
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    global: 'globalThis',
    'process.env': '{}'
  },
  optimizeDeps: {
    include: ['formengine', 'rsuite']
  }
})