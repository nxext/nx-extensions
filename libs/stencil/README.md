# @nxext/stencil --- Stencil Plugin for Nx (Alpha)

## Features

- Generate Ionic/Pwa project
- Generate Stencil app project
- Generate library project

## Usage

Add this plugin to an Nx workspace:

```
yarn add @nxext/stencil
```

or

```
npm install @nxext/stencil --save
```

Generate your projects:

```
nx g @nxext/stencil:app my-app
nx g @nxext/stencil:pwa my-app
nx g @nxext/stencil:lib my-lib
```

Build your project:

```
nx build my-app
```

Run commands are passed to the [stencil compiler](https://stenciljs.com/docs/cli).
Supported flags are:

- --ci
- --debug
- --dev
- --docs
- --port=1234
- --serve
- --verbose
- --watch
