---
title: Ionic PWA
description:
---

Generates a Ionic Progressive Web App

## Usage

```bash
nx g @nxext/stencil:pwa my-app
```

or

```bash
nx g @nxext/stencil:ionic-pwa my-app
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

### --e2eTestRunner

Default: `cypress`

Possible values: cypress, none

Type: `enum`

Adds the specified e2e test runner.

### --style

Default: `css`

Possible values: css, scss, styl, less, pcss

Type: `list`

The file extension to be used for style files.

### --skipFormat

Default: `false`

Type: `boolean`
