import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: '/', // Importante para o nginx
    server: {
      port: 5173,
      open: true,
      cors: true,
      host: true // Permite acesso externo
    },
    preview: {
      port: 4173,
      host: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'terser',
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa as dependências grandes em chunks
            'mui-core': ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
            'mui-icons': ['@mui/icons-material'],
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'http': ['axios'],
            'form': ['react-hook-form', '@hookform/resolvers'],
            'formengine': ['@react-form-builder/core', '@react-form-builder/designer', '@react-form-builder/components-rsuite'],
            'rsuite': ['rsuite', '@rsuite/icons'],
            'utils': ['@hello-pangea/dnd', '@tanstack/react-query', 'mobx', 'mobx-react-lite']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: [
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'rsuite',
        '@react-form-builder/core',
        '@react-form-builder/designer',
        '@react-form-builder/components-rsuite'
      ]
    },
    define: {
      // Define variáveis globais
      'process.env.NODE_ENV': JSON.stringify(mode),
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'https://formsmenuapi.gabrielsanztech.com.br'),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0')
    }
  }
})