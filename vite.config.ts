import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('.', import.meta.url)),
        }
      },
      build: {
        // Enable source maps for better debugging in production
        sourcemap: mode === 'development',
        // Optimize chunk splitting
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunk for React and related libraries
              'vendor-react': ['react', 'react-dom'],
              // Vendor chunk for UI libraries
              'vendor-ui': ['react-quill'],
              // Vendor chunk for utilities
              'vendor-utils': ['uuid'],
              // Vendor chunk for Google AI
              'vendor-ai': ['@google/genai']
            },
            // Optimize chunk naming for better caching
            chunkFileNames: (chunkInfo) => {
              const facadeModuleId = chunkInfo.facadeModuleId ?
                chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk';
              return `chunks/${facadeModuleId}-[hash].js`;
            },
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name!.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `images/[name]-[hash][extname]`;
              }
              if (/css/i.test(ext)) {
                return `styles/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            }
          }
        },
        // Enable minification
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: mode === 'production'
          }
        },
        // Target modern browsers for better performance
        target: 'esnext',
        // Enable CSS code splitting
        cssCodeSplit: true
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-quill', 'uuid']
      }
    };
});
