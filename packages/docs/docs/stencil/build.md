---
id: build
title: Build, Test and Serve
---

## Build

Build your project:

```
nx build my-app
```

Run commands are passed to the [stencil compiler](https://stenciljs.com/docs/cli).
Supported flags are:

| Parameter    | Type   | Default                                                                                  | Description                  |
| ------------ | ------ | ---------------------------------------------------------------------------------------- | ---------------------------- |
| --ci         | bool   | false                                                                                    |                              |
| --debug      | bool   | false                                                                                    |                              |
| --dev        | bool   | false                                                                                    |                              |
| --docs       | bool   | false                                                                                    |                              |
| --port=1234  | number |                                                                                          |                              |
| --serve      | bool   | false                                                                                    |                              |
| --verbose    | bool   | false                                                                                    |                              |
| --watch      | bool   | false                                                                                    |                              |
| --configPath | string | "libs/**_projectname_**/stencil.config.ts" or "apps/**_projectname_**/stencil.config.ts" | relative from workspace root |

You can define the path for the stencil.config.ts file like this:
The configPath is set in the workspace.json/angular.json for each builder. The default used path can be change there.

Support for tests. For unit tests run:

## Test

```
nx test my-app
```

## Watch

Supported flags are:

- --watch

For e2e test:

```
nx e2e my-app
```

## Serve

Serve with:

```
nx serve my-app
```

Supported flags are:

| Parameter    | Type    | Default                                                                                  | Description                  |
| ------------ | ------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| --debug      | bool    | false                                                                                    |                              |
| --dev        | bool    | false                                                                                    |                              |
| --docs       | bool    | false                                                                                    |                              |
| --port=1234  | number  |                                                                                          |                              |
| --verbose    | bool    | false                                                                                    |                              |
| --configPath | string  | "libs/**_projectname_**/stencil.config.ts" or "apps/**_projectname_**/stencil.config.ts" | relative from workspace root |
| --open       | boolean | true                                                                                     |                              |
