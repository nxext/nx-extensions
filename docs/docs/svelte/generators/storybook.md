---
id: storybook
title: Storybook
---

You can generate Storybook configuration for an individual project with this command:

## Usage

```
nx g @nxext/svelte:storybook-configuration my-lib
```

## Options

### --name

Type: `string`

Library or application name

### --configureCypress

Type: `boolean`

Run the cypress-configure generator

### --cypressDirectory

Type: `string

A directory where the Cypress project will be placed. Added at root by default.

### --linter

Type: `string`

The tool to use for running lint checks.

### --js

Type: `boolean`

Generate JavaScript files rather than TypeScript files

### --standaloneConfig

Type: `boolean`

Split the project configuration into <projectRoot>/project.json rather than including it inside workspace.json
