## 19.2.0 (2024-10-06)


### 🚀 Features

- update to nx 15.2.0 ([eb16e414](https://github.com/nxext/nx-extensions/commit/eb16e414))

- migrate to nx 16.6 ([f6daab02](https://github.com/nxext/nx-extensions/commit/f6daab02))

- **capacitor:** add capacitor plugin ([dbd972f2](https://github.com/nxext/nx-extensions/commit/dbd972f2))

- **ionic-react:** add ionic-react plugin ([28e29a03](https://github.com/nxext/nx-extensions/commit/28e29a03))

- **nxext:** move from @nrwl/devkit to @nxext/devkit ([be72c863](https://github.com/nxext/nx-extensions/commit/be72c863))

- **nxext:** move from @nrwl/devkit to @nxext/devkit ([a96856fd](https://github.com/nxext/nx-extensions/commit/a96856fd))

- **nxext:** update to Nx 14.8.5 ([c657fc83](https://github.com/nxext/nx-extensions/commit/c657fc83))

- **capacitor:** add app generator ([c2beee95](https://github.com/nxext/nx-extensions/commit/c2beee95))

- **capacitor:** add option for cap to preserve project node_modules folder ([c9ac4948](https://github.com/nxext/nx-extensions/commit/c9ac4948))

- **ionic-angular,capacitor:** replace app generator by a config generator ([03ee8840](https://github.com/nxext/nx-extensions/commit/03ee8840))

- **capacitor:** bump capacitor packages to v6 ([c4d5959b](https://github.com/nxext/nx-extensions/commit/c4d5959b))


### 🩹 Fixes

- command ([87678ab1](https://github.com/nxext/nx-extensions/commit/87678ab1))

- Invert the preserveNodeModules option ([79e4e2ed](https://github.com/nxext/nx-extensions/commit/79e4e2ed))

- use execSync to allow command to be interactive ([ec03b860](https://github.com/nxext/nx-extensions/commit/ec03b860))

- set success as false explicitly ([db7cb43d](https://github.com/nxext/nx-extensions/commit/db7cb43d))

- inherit stdio for capacitor cli command ([a10efbfb](https://github.com/nxext/nx-extensions/commit/a10efbfb))

- **capacitor:** ensure npx uses @capacitor/cli executable ([42302646](https://github.com/nxext/nx-extensions/commit/42302646))

- **ionic-angular:** fix unit tests ([e9ed1a22](https://github.com/nxext/nx-extensions/commit/e9ed1a22))

- **capacitor:** use installed cli to execute commands ([aa880321](https://github.com/nxext/nx-extensions/commit/aa880321))

- **ionic-react:** fix lint error ([1c24a31c](https://github.com/nxext/nx-extensions/commit/1c24a31c))

- **nxext:** fix linting errors and add dependency linting ([303dd3f8](https://github.com/nxext/nx-extensions/commit/303dd3f8))

- **capacitor:** use the configured distDir to check if the build is already used ([f7c8c72c](https://github.com/nxext/nx-extensions/commit/f7c8c72c))

- **capacitor:** add `@capacitor/app` dependency ([842418f2](https://github.com/nxext/nx-extensions/commit/842418f2))

- **capacitor:** support standalone workspaces ([7ff4baf8](https://github.com/nxext/nx-extensions/commit/7ff4baf8))


### ❤️  Thank You

- Arend-Jan Tetteroo
- blackholegalaxy @blackholegalaxy
- Callum Smale @Schmale97
- Dominik Pieper @DominikPieper
- Edouard Bozon @edbzn
- Jordan Hall @Jordan-Hall
- Mertcan Celik

# Changelog

# 13.0.0

## Features

- support Nx 13

# 12.1.0

## Features

- restore Angular CLI support

# 12.0.0

## Features

- support Nx 12
- plugin rewritten with `@nx/devkit` for better maintainability and future proofing for future Nx versions
- update Capacitor to 3.2.5
- add Capacitor `run` target (requires Capacitor 3)

## BREAKING CHANGES

- Angular CLI is no longer officially supported
- `add-plugin` schematic has been removed
- the `init` generator has been removed and the functionaltiy has been moved to the `application` schematic

# 11.1.1

## Bug Fixes

- support Nx 11.3.0

# 11.1.0

## Features

- support quotes in `cap` builder `cmd` option (useful for passing additional options for Capacitor commands)

# 11.0.2

## Bug Fixes

- support `angular.json` as well as `workspace.json` during migrations

# 11.0.1

## Bug Fixes

- fix 11.0.0 workspace migration

# 11.0.0

## Features

- Nx 11 support (Nx 11 now required)
- update Capacitor to 2.4.5
- added `cap` builder for a more generic interface with the Capacitor CLI

## BREAKING CHANGES

- the `command` builder has been removed

# 2.0.2

# Fixes

- fix Windows support

# Features

- update Capacitor to 2.4.2
- add Capacitor configs to frontend application
- add or update `package.json` in project folder when generating a Capacitor project
- add builder configurations for Nx Console
- add `add-plugin` schematic for adding Capacitor plugins

# BREAKING CHANGES

- Capacitor plugins must now be added to both the root and project-level `package.json`

# 1.1.0

## Features

- upgrade Capacitor to 2.4.0
- copy package.json from workspace root for cap commands
