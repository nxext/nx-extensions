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

each generator is able to generate your template with different style variants. Supported are:

```
--style=css (default)
--style=scss
--style=less
--style=styl
--style=pcss
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

You can define the path for the stencil.config.ts file like this:

```
nx build pwa --configPath=apps/pwa/components/stencil.config.ts
```

- --configPath relative from workspace root

Support for tests. For unit tests run:

```
nx test my-app
```

Supported flags are:

- --watch

For e2e test:

```
nx e2e my-app
```
