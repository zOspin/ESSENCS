import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import adminApi from './vite-plugins/adminApi.js';

export default defineConfig({
  plugins: [react(), tailwindcss(), adminApi()],
});
