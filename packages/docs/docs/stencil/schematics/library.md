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

### --skipFormat

Default: `false`

Type: `boolean`
