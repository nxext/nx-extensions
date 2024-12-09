## 20.1.0 (2024-12-09)

### 🚀 Features

- **capacitor:** add inference plugin ([6f2d7a51](https://github.com/nxext/nx-extensions/commit/6f2d7a51))

### ❤️  Thank You

- Edouard Bozon @edbzn

## 20.0.2 (2024-11-04)

### 🩹 Fixes

- **capacitor:** align default web-dir for esbuild executor ([df7d67d8](https://github.com/nxext/nx-extensions/commit/df7d67d8))
- **capacitor:** align default web-dir for esbuild executor ([25160590](https://github.com/nxext/nx-extensions/commit/25160590))

### ❤️  Thank You

- Paweł Twardziak

## 20.0.1 (2024-10-15)

### 🩹 Fixes

- add assert-not-using-ts-solution-setup to the generators ([#1140](https://github.com/nxext/nx-extensions/pull/1140))

### ❤️  Thank You

- pawel-twardziak

# 20.0.0 (2024-10-14)

### 🚀 Features

- ⚠️  migrate workspace to Nx 20 ([#1136](https://github.com/nxext/nx-extensions/pull/1136))

### ⚠️  Breaking Changes

- generator option `name` is replaced by `directory`, and the minimal required Nx version is `20.x`."

### ❤️  Thank You

- pawel-twardziak

## 19.1.2 (2024-10-08)


### 🩹 Fixes

- **capacitor:** move nx deps to peer deps ([2ed1edc6](https://github.com/nxext/nx-extensions/commit/2ed1edc6))


### ❤️  Thank You

- Edouard Bozon @edbzn

## 19.1.1 (2024-10-07)


### 🩹 Fixes

- **capacitor:** add `@capacitor/app` dependency ([842418f2](https://github.com/nxext/nx-extensions/commit/842418f2))

- **capacitor:** support standalone workspaces ([7ff4baf8](https://github.com/nxext/nx-extensions/commit/7ff4baf8))


### ❤️  Thank You

- Edouard Bozon @edbzn

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
