// vite.config.js
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sveltePlugin = require('@sveltejs/vite-plugin-svelte').svelte;

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    sveltePlugin()
  ],
  build: {
    polyfillDynamicImport: false,
  },
});
