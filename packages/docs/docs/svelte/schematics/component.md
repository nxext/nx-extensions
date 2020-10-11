---
id: component
title: Component
---

Generates a Stencil application

This schematic also executes the [Core](core) schematic

## Usage
```
nx g @nxext/stencil:c my-app
```

or

```
nx g @nxext/stencil:component my-app
```

## Options

### --project

Alias(es): p

Type: `string`

Project where the component is generated

### --directory

Alias(es): d

Type: `string`

A directory where the project is placed

### --unitTestRunner

Default: `jest`

Possible values: jest, none

Type: `enum`

Adds the specified unit test runner.

### --skipFormat

Default: `false`

Type: `boolean`
