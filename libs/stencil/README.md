# @nxext/stencil

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

| Parameter    | Type   | Default                                                                                  | Description                  |
| ------------ | ------ | ---------------------------------------------------------------------------------------- | ---------------------------- |
| --ci         | bool   | false                                                                                    |                              |
| --debug      | bool   | false                                                                                    |                              |
| --dev        | bool   | false                                                                                    |                              |
| --docs       | bool   | false                                                                                    |                              |
| --port=1234  | number |                                                                                          |                              |
| --serve      | bool   | false                                                                                    |                              |
| --verbose    | bool   | false                                                                                    |                              |
| --watch      | bool   | false                                                                                    |                              |
| --configPath | string | "libs/**_projectname_**/stencil.config.ts" or "apps/**_projectname_**/stencil.config.ts" | relative from workspace root |

You can define the path for the stencil.config.ts file like this:
The configPath is set in the workspace.json/angular.json for each builder. The default used path can be change there.

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

Serve with:

```
nx serve my-app
```

Supported flags are:

| Parameter    | Type   | Default                                                                                  | Description                  |
| ------------ | ------ | ---------------------------------------------------------------------------------------- | ---------------------------- |
| --ci         | bool   | false                                                                                    |                              |
| --debug      | bool   | false                                                                                    |                              |
| --dev        | bool   | false                                                                                    |                              |
| --docs       | bool   | false                                                                                    |                              |
| --port=1234  | number |                                                                                          |                              |
| --verbose    | bool   | false                                                                                    |                              |
| --configPath | string | "libs/**_projectname_**/stencil.config.ts" or "apps/**_projectname_**/stencil.config.ts" | relative from workspace root |
