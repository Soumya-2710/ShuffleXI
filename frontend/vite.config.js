import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.BACKEND_URL || env.VITE_BACKEND_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      host: true, // Listen on all network addresses (0.0.0.0) for Docker container support
      port: 3000,
      watch: {
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
      },
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

