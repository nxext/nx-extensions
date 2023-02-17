# @nxext/vite

[![License](https://img.shields.io/npm/l/@nxext/svelte.svg?style=flat-square)]()
[![nxext macos CI](https://github.com/nxext/nx-extensions/workflows/nxext%20macos%20CI/badge.svg)]()

## Getting Started

Add this plugin to an Nx workspace:

```
yarn add --dev @nxext/vitest
```

or

```
npm install @nxext/vitest --save-dev
```

Generate your project configuration:

```
nx g @nxext/vitest:vitest-project my-app --framework=generic|svelte
```

for an existing project. There are options for the framework. The default is generic with no spacial options and svelte adds the vite-svelte-plugin to the vitest.config.ts.

Use it e.g with @nxext/svelte
