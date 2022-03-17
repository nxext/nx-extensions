# Angular Vite plugin

This project is in alpha stages and should be carefule of using in production. This is built onto of our angular-swc compiler/plugin

## Notice: 
angular-vite-compiler is no longer being maintainced - this was create during prototype stages. It's a vite NGC base inspired by [@VirtualOverride](https://twitter.com/VirtualOverride) rollup plugin. This has been replaced by vite-plugin-angular which is a ground up rewrite away from NGC and Angular. We believe the future needed a rewrite away from NGC and a purer vite plugin.   

## Example

```
// vite.config.js
import { defineConfig } from 'vite';
import { ViteAngularPlugin } from '@nxext/angular-vite';

export default defineConfig({
  plugins: [ViteAngularPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
});

```
