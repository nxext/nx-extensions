// vite.config.js
import { defineConfig } from 'vite';

import { AngularPlugin } from './angular-vite-compiler';

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
