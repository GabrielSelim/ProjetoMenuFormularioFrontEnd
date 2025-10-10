import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
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
          'utils': ['@hello-pangea/dnd', '@tanstack/react-query']
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
      'axios'
    ]
  },
  define: {
    // Evita warnings em produção
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})