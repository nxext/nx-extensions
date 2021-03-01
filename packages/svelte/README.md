# @nxext/svelte

[![License](https://img.shields.io/npm/l/@nxext/svelte.svg?style=flat-square)]()
[![nxext windows CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%20windows%20CI/badge.svg)]()
[![nxext macos CI](https://github.com/DominikPieper/nx-extensions/workflows/nxext%20macos%20CI/badge.svg)]()

## Table of Contents

- [Usage](#usage)
- [Project schematics](#project-schematics)
- [Build](#build)
- [Serve](#serve)

## Usage

Add this plugin to an Nx workspace:

```
yarn add --dev @nxext/svelte
```

or

```
npm install @nxext/svelte --save-dev
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

Supported flags are:

| Parameter | Type | Default | Description            |
| --------- | ---- | ------- | ---------------------- |
| --dev     | bool | false   | Is dev build           |
| --watch   | bool | false   | Start watchmode        |
| --serve   | bool | false   | Serve on dev webserver |
| --open    | bool | false   | Open in browser        |

## Serve

Serve with:

```
nx serve my-app
```

Supported flags are:

| Parameter | Type    | Default | Description  |
| --------- | ------- | ------- | ------------ |
| --dev     | bool    | false   | Is dev build |
| --open    | boolean | false   |              |
