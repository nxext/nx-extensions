// vite.config.js
import { defineConfig } from 'vite';
import { ViteAngularPlugin } from './vite-plugin-angular';

export default defineConfig({
  plugins: [
    ViteAngularPlugin({
      target: 'es2020',
    }),
  ],
  resolve: {
    preserveSymlinks: true,
  }
});
