// vite.config.js
import { defineConfig } from 'vite';

// using import {} changes on build to solidPlugin.default when it shouldn't be
// eslint-disable-next-line @typescript-eslint/no-var-requires
import preact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [preact()],
});
