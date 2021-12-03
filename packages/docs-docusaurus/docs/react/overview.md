---
id: overview
title: Overview
---

# Overview of Nxext React

The Nxext Plugin for React contains generators for managing React applications and libraries within an Nx workspace . It provides:

- Vite alterntive to webpack (@nrwl/web)
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

- [build](../vite/executors/build) - Builds a web components application
- [dev](..vite/executors/serve) - Builds and serves a web application
- [package](../vite/executors/package) - Bundles artifacts for a buildable library that can be distributed as an NPM package.

## Generators

We have adapted the @nrwl/react plugin to create to create the scaffolding for the vite builds. For components and redux we still recommend using @nrwl/react

- [application](./generators/application) - Create an React application
- [library](./generators//library) - Create an React library

[@nxext/react](https://github.com/nxext/nx-extensions/tree/master/packages/react) is a nx plugin to bring [react](https://reactjs.org/) vite builds to [Nx](https://nx.dev/).
