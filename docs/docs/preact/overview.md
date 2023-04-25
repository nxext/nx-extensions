# Overview of Nxext Preact

The Nxext Plugin for preact contains generators for managing Preact applications and libraries within an Nx workspace . It provides:

- Vite alterntive to webpack (@nx/web)
- Quicker and smaller builds

## Adding the preact plugin

Adding the preact plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/preact
```

```bash
#npm
npm install -D @nxext/preact
```

## Executors / Builders

Our Preact applications are built using the executors from the [@nxext/vite](../vite/overview.md) plugin.
