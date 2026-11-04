/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' : le build fonctionne dans n'importe quel sous-dossier (GitHub Pages, Netlify, clé USB…)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    // Sortie dans ../belle-etoile/ : servi par GitHub Pages à /louis/belle-etoile/
    outDir: '../belle-etoile',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber'],
        },
      },
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
