---
id: application
title: Application
---

Generates a Svelte application

This schematic also executes the [Init](init) schematic

## Usage

```
nx g @nxext/svelte:app my-app
```

## Options

### --tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

### --linter

Default: `eslint`

Possible values: eslint

Type: `enum`

Add tags to the project (used for linting)

### --unitTestRunner

Default: `jest`

Possible values: jest, none

Type: `enum`

Adds the specified unit test runner.

### --e2eTestRunner

Default: `cypress`

Possible values: cypress, none

Type: `enum`

Adds the specified e2e test runner.

### --port

Default: `4200`

Type: `number`

Port to listen on.

### --host

Default: `localhost`

Type: `number`

Host to listen on.
