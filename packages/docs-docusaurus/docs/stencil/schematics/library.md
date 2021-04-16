---
id: library
title: Library
---

Generates a Stencil library

This schematic also executes the [Core](core) schematic

## Usage

```
nx g @nxext/stencil:lib my-app
```

or

```
nx g @nxext/stencil:library my-app
```

## Options

### --tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

### --directory

Alias(es): d

Type: `string`

A directory where the project is placed

### --style

Default: `css`

Possible values: css, scss, styl, less, pcss

Type: `list`

The file extension to be used for style files.

## --buildable

Default: false

Type: `boolean`

Generate the build and e2e commands and be able to build and redistribute the library independently.

## --publishable

Default: false

Type: `boolean`

Set the importPath, generate the build and e2e commands and be able to build and redistribute the library independently.

## --importPath

Type: `string`

ImportPath used for publishable libraries and set into the package.json

### --skipFormat

Default: `false`

Type: `boolean`
