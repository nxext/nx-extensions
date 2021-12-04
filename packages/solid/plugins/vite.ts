// vite.config.js
import { defineConfig } from 'vite';
const solidPlugin = require('vite-plugin-solid');

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    polyfillDynamicImport: false,
  },
});
