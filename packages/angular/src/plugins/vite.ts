// vite.config.js
import { defineConfig, Plugin } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ngcPlugin = require('./angular-compiler');

import { AngularPlugin } from './angular-compiler-v0.1';

export default defineConfig({
  plugins: [
    AngularPlugin({
      tsconfig: 'tsconfig.app.json',
      substitutions: undefined,
      directTemplateLoading: false,
      emitClassMetadata: false,
      emitNgModuleScope: false,
      jitMode: true,
    }),
  ],
  esbuild: false,
});

export const original = defineConfig({
  plugins: [ngcPlugin()],
});
