import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pigment } from '@pigment-css/vite-plugin';
import path from 'path';
import theme from './src/theme/theme';

export default defineConfig({
  plugins: [
    pigment({
      theme: theme,
      // Mantemos comentado para evitar o erro do StyledEngineProvider
      // transformLibraries: ['@mui/material'], 
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "/@react-refresh": path.resolve(__dirname, "./src/utils/noop.js"),
    },
  },
  ssr: {
    noExternal: ['@mui/material', '@mui/icons-material', '@mui/system'],
  },
  optimizeDeps: {
    include: [
      'react-is',
      '@mui/material-pigment-css',
      'prop-types',
      '@mui/utils'
    ],
  },
});