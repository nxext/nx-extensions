// vite.config.js
import { defineConfig } from 'vite';

import { ngcPlugin } from './angular-compiler';

export default defineConfig({
  plugins: [ngcPlugin()],
});
