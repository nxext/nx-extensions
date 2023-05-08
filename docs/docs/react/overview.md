# Overview of Nxext React

The Nxext Plugin for React contains generators for managing React applications and libraries within an Nx workspace . It provides:

- Vite alterntive to webpack (@nx/web)
- Quicker and smaller builds

## Adding the React plugin

Adding the React plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/react
```

```bash
#npm
npm install -D @nxext/react
```

> Warning: unlike the webpack version provided by [NX](https://nx.dev). Our vite builds does not support images as components. Instead when you import images `import logo from 'logo.svg` you will get the image URL to be used inside of the image tag `<img src={logo}/>`

## Executors / Builders

Our React applications are built using the executors from the [@nxext/vite](../vite/overview.md) plugin.
