// vite.config.js
import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Inspect = require('vite-plugin-inspect');

import { ViteAngularPlugin } from './vite-plugin-angular';

export default defineConfig({
  plugins: [
    Inspect(),
    ViteAngularPlugin({
      tsconfig: 'tsconfig.app.json',
      substitutions: undefined,
      directTemplateLoading: false,
      emitClassMetadata: false,
      emitNgModuleScope: false,
      jitMode: true,
      target: 'es2020',
    }),
  ],
  esbuild: false,
});
