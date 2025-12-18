import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const _env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Do not inject secret keys into the client bundle.
      // Client-side bundles must never contain sensitive secrets like GEMINI_API_KEY.
      // Keep `define` available for non-sensitive build-time constants if needed.
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});

