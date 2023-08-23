# Overview of the Vue plugin

[@nxext/vue](https://github.com/nxext/nx-extensions/tree/main/packages/vue) is a Nx plugin to bring [VueJs](https://vuejs.org/) to [Nx](https://nx.dev/).

The @nxext/vue package also includes a dependency graph plugin for Nx, in order to support Vues single file components (SFCs) in the dependency graph.
When using @nxext/vue or @nxext/nuxt, @nxext/vue is automatically added to the Nx plugins section within the nx.json file in your workspace root. The dependency graph will show the dependencies between any Vue SFCs within your workspace.

## Adding the Vue plugin

Adding the Vue plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/vue
```

```bash
#npm
npm install -D @nxext/vue
```

## Executors / Builders

Our Vue applications are built using the executors from the [@nx/vite](https://nx.dev/packages/vite) plugin.
