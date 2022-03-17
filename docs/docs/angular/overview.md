# Overview of Nxext Angular

The Nxext Plugin for Angular contains generators for managing Angular applications and libraries within an Nx workspace . It provides:

- Vite alternative to webpack (@nrwl/web)
- Quicker and smaller builds

## Adding the Angular plugin

Adding the Angular plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/angular
```

```bash
#npm
npm install -D @nxext/angular
```

## Executors / Builders

Our Angular applications are built using the executors from the [@nxext/vite](../vite/overview.md) plugin.
