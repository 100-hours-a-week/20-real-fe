import { config } from 'dotenv';
import path from 'path';
import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    env: { ...config({ path: './.env.development' }).parsed },
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**.stories.**',
        '**.config.**',
        '**/.storybook/**',
        '**/public/**',
        '**/.next/**',
        '**/node_modules/**',
        '**/test/**',
        '**/index.**',
        '**/tiptap-icons/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
