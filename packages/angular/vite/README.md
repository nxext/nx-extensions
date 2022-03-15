# Angular Vite plugin

This project is in alpha stages and should be carefule of using in production. This is built onto of our angular-swc compiler/plugin

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
