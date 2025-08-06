import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import tailwindcss from '@tailwindcss/postcss';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      external: [
        '@google-cloud/storage',
        'fs',
        'path',
        'crypto',
        'stream',
        'url',
        'util',
        'os',
        'child_process',
        'querystring',
        'http',
        'https',
        'net',
        'tls',
        'assert',
        'zlib',
      ],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    global: 'globalThis',
  },
  server: {
    https: {
      cert: path.join(__dirname, 'cert', 'localhost.pem'),
      key: path.join(__dirname, 'cert', 'localhost-key.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
