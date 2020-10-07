# @nxext/svelte

[![License](https://img.shields.io/npm/l/@nxext/stencil.svg?style=flat-square)]()
[![NPM Version](https://badge.fury.io/js/%40nxext%2Fstencil.svg)](https://www.npmjs.com/@nxext/stencil)
[![nxext windows CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%%20windows%20CI/badge.svg)]()
[![nxext macos CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%%20macos%20CI/badge.svg)]()

## Table of Contents

- [Usage](#usage)
- [Project schematics](#project-schematics)
- [Build](#build)
- [Test](#test)
- [Watch](#watch)
- [Serve](#serve)
- [Storybook](#storybook)
- [React and Angular](#react-and-angular)
- [Capacitor App](#capacitor-app)

## Usage

Add this plugin to an Nx workspace:

```
yarn add @nxext/svelte
```

or

```
npm install @nxext/svelte --save
```

## Project schematics

Generate your project:

```
nx g @nxext/svelte:app my-app
```

You can generate components with:

```
nx g @nxext/svelte:component my-comp
```

or

```
nx g @nxext/svelte:c my-comp
```

## Build

Build your project:

```
nx build my-app
```

Run commands are passed to the [stencil compiler](https://stenciljs.com/docs/cli).
Supported flags are:

| Parameter | Type | Default | Description |
| ------------ | ------ | ---------------------------------------------------------------------------------------- | ---------------------------- | | |
| --debug | bool | false | |

## Serve

Serve with:

```
nx serve my-app
```

Supported flags are:

| Parameter | Type    | Default | Description |
| --------- | ------- | ------- | ----------- |
| --open    | boolean | false   |             |
