# @nxext/stencil

[![License](https://img.shields.io/npm/l/@nxext/stencil.svg?style=flat-square)]()
[![NPM Version](https://badge.fury.io/js/%40nxext%2Fstencil.svg)](https://www.npmjs.com/@nxext/stencil)
[![@nxext/stencil windows CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%20stencil%20windows%20CI/badge.svg)]()
[![nxext stencil linux CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%20stencil%20linux%20CI/badge.svg)]()

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Project schematics](#project-schematics)
- [Build](#build)
- [Test](#test)
- [Watch](#watch)
- [Serve](#serve)
- [Storybook](#storybook)

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

## Project schematics

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

You can generate components with:

```
nx g @nxext/stencil:component my-comp
```

or

```
nx g @nxext/stencil:c my-comp
```

If [Storybook](#storybook) is configured a `<my-comp>.stories.ts` is generated.

## Build

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

## Test

```
nx test my-app
```

## Watch

Supported flags are:

- --watch

For e2e test:

```
nx e2e my-app
```

## Serve

Serve with:

```
nx serve my-app
```

Supported flags are:

| Parameter    | Type    | Default                                                                                  | Description                  |
| ------------ | ------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| --debug      | bool    | false                                                                                    |                              |
| --dev        | bool    | false                                                                                    |                              |
| --docs       | bool    | false                                                                                    |                              |
| --port=1234  | number  |                                                                                          |                              |
| --verbose    | bool    | false                                                                                    |                              |
| --configPath | string  | "libs/**_projectname_**/stencil.config.ts" or "apps/**_projectname_**/stencil.config.ts" | relative from workspace root |
| --open       | boolean | true                                                                                     |                              |

## Storybook

You can generate Storybook configuration for an individual project with this command:

```
nx g @nxext/stencil:storybook-configuration my-lib
```

To run the generated Storybook use:

```
nx storybook my-lib
```

_The Storybook startup needs an successful `nx build` cause of the generated loaders to work_
