---
id: ionic-app
title: Ionic App
---

You're able to generate a StencilJs and Capacitor based mobile app.

This schematic also executes the [Core](core) schematic

After that build it and follow the given instructions to add capacitors platform platforms. (look [here](https://nxtend.dev/docs/capacitor/getting-started) for the nx capacitor plugin documentation.)

## Usage

```
nx g @nxext/stencil:ionic-app my-app
```

## Options

### --appTemplate

Default: `Tabs`

Possible values: Tabs

Type: `enum`

Possible Ionic app starter

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
