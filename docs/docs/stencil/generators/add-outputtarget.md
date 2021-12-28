---
id: add-outputtarget
title: Add Outputtargets
---

You're able to generate angular/react libraries for yout stencil libraries using stencils outputtargets:

## Usage

```
nx g @nxext/stencil:add-outputtarget my-lib
```

With the `--outputType='react'`, `--outputType='angular'` or `--outputType='vue'` you can define the kind of library.

## Options

### --outputType

Type: `enum`

Possible values: angular, react

Select what kind of library you want to generate.

### --publishable

Default: `false`

Type: `boolean`

Creates a publishable lib and adds a package.json
