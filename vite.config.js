import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true // automatically open browser on start
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});