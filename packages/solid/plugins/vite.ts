// vite.config.js
import { defineConfig } from 'vite';

// using import {} changes on build to solidPlugin.default when it shouldn't be
// eslint-disable-next-line @typescript-eslint/no-var-requires
const solidPlugin = require('vite-plugin-solid');

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    polyfillDynamicImport: false,
  },
});
