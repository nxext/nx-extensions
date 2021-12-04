---
id: migrating-overview
title: Migrating from @nrwl/web to @nxext/vite
---

# Introduction to Nxext Vite

[@nxext/vite](https://github.com/nxext/nx-extensions/tree/master/packages/vite) is a nx plugin to bring [Solid](https://solid.dev/) and [Svelte](https://svelte.dev/) to [Nx](https://nx.dev/).

We at Nxext believe the key to productivity is faster builds. [Nrwl NX](https://nx.dev) has done an amazing job with the enterprise-level monorepo. However, the crocks are still tied in [Angular](https://angular.io) and as a result [Webpack](https://webpack.js.org/). So we've turned to [Vite](https://vitejs.dev/) a build system that's bother quicker and smaller bundles.

## Adding Vite builds

Adding the React plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/vite
```

```bash
#npm
npm install -D @nxext/vite
```
