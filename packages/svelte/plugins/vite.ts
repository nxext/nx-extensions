// vite.config.js
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sveltePlugin = require('@sveltejs/vite-plugin-svelte').svelte;

export default defineConfig({
  plugins: [sveltePlugin()],
});
