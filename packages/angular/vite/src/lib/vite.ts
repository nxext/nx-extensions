// vite.config.js
import { defineConfig } from 'vite';
import { ViteAngularPlugin } from './vite-plugin-angular';

export default defineConfig({
  plugins: [ViteAngularPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
});
