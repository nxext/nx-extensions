import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import tailwindcss  from 'tailwindcss';

export const config: Config = {
  namespace: 'nxext',
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  plugins: [
    postcss({
      plugins: [
        tailwindcss('./packages/docs/tailwind.config.js')
      ]
    })
  ],
  outputTargets: [
    {
      type: 'www',
      baseUrl: 'https://nxext.dev/',
      prerenderConfig: './prerender.config.ts',
      serviceWorker: null
    }
  ],
  extras: {
    scriptDataOpts: true,
    shadowDomShim: true,
    appendChildSlotFix: true
  },
  devServer: {
    reloadStrategy: 'hmr'
  }
};
