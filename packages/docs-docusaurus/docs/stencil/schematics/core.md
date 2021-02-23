---
id: core
title: Core
---

_The user don't need to call this. It'll be called by the application schematics automatically._

This schematic possibly installs the following dependencies:

```
@stencil/core
@stencil/router

puppeteer
@types/puppeteer

@stencil/less
@stencil/sass
@stencil/stylus

@stencil/postcss
autoprefixer
@types/autoprefixer
```

## Usage

```
nx g @nxext/stencil:core
```

## Options

### --skipFormat

Default: `false`

Type: `boolean`
