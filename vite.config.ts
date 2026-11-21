
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // GitHub Pages deployment path
    base: '/Gowtham-Pandiyan/',

    // Vite plugins
    plugins: [
      react(),
      tailwindcss(),
    ],

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    // Development server configuration
    server: {
      // Disable HMR in Google AI Studio when required
      hmr: process.env.DISABLE_HMR !== 'true',

      // Disable file watching when required
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {},
    },
  };
});
