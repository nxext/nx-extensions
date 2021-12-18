// vite.config.js
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ngcPlugin = require('./angular-compiler');

export default defineConfig({
  plugins: [ngcPlugin()],
});
