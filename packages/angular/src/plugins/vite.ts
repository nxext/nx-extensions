// vite.config.js
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const ngcPlugin = require('./angular-compiler');

import { AngularPlugin } from './angular-compiler-v0.1';

export default defineConfig({
  plugins: [
    AngularPlugin({
      tsconfig: 'tsconfig.json',
      substitutions: undefined,
      directTemplateLoading: false,
      emitClassMetadata: false,
      emitNgModuleScope: false,
      jitMode: true,
    }),
  ],
  esbuild: false,
});
