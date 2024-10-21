## 20.0.2 (2024-10-21)

### 🩹 Fixes

- ts version with minor and patch being flexible ([60686d4f](https://github.com/nxext/nx-extensions/commit/60686d4f))

### ❤️  Thank You

- Paweł Twardziak

## 20.0.1 (2024-10-15)

### 🩹 Fixes

- add assert-not-using-ts-solution-setup to the generators ([#1140](https://github.com/nxext/nx-extensions/pull/1140))

### 🧱 Updated Dependencies

- Updated capacitor to 20.0.1

### ❤️  Thank You

- pawel-twardziak

# 20.0.0 (2024-10-14)

### 🚀 Features

- ⚠️  migrate workspace to Nx 20 ([#1136](https://github.com/nxext/nx-extensions/pull/1136))

### ⚠️  Breaking Changes

- generator option `name` is replaced by `directory`, and the minimal required Nx version is `20.x`."

### 🧱 Updated Dependencies

- Updated capacitor to 20.0.0

### ❤️  Thank You

- pawel-twardziak

## 19.1.2 (2024-10-08)


### 🩹 Fixes

- **ionic-angular:** move nx deps to peer deps ([dd64b892](https://github.com/nxext/nx-extensions/commit/dd64b892))


### 🧱 Updated Dependencies

- Updated capacitor to 19.1.2


### ❤️  Thank You

- Edouard Bozon @edbzn

## 19.1.1 (2024-10-07)


### 🩹 Fixes

- **ionic-angular:** use the prefix for components ([b084cd97](https://github.com/nxext/nx-extensions/commit/b084cd97))

- **ionic-angular:** add missing capacitor plugins ([7b39d7df](https://github.com/nxext/nx-extensions/commit/7b39d7df))

- **ionic-angular:** resolve routes import correctly ([e447abc4](https://github.com/nxext/nx-extensions/commit/e447abc4))

- **ionic-angular:** move main.ts to src ([104065eb](https://github.com/nxext/nx-extensions/commit/104065eb))

- **ionic-angular:** update jest config to work with ionic ([91003d18](https://github.com/nxext/nx-extensions/commit/91003d18))

- **ionic-angular:** update jest config correctly ([b0a6ef82](https://github.com/nxext/nx-extensions/commit/b0a6ef82))


### 🧱 Updated Dependencies

- Updated capacitor to 19.1.1


### ❤️  Thank You

- Edouard Bozon @edbzn

# Changelog

# 14.0.0

# Features

- generate applications with Ionic v6

# 13.1.0

# Features

- add page generator (courtesy of @joshuamorony)

# 13.0.0

## Features

- support Nx 13

# 12.1.0

## Features

- restore Angular CLI support
- add `--standaloneConfig` to application generator to generate a `package.json` instead of updating the `workspace.json`

# 12.0.0

## Features

- support Nx 12
- plugin rewritten with `@nx/devkit` for better maintainability and future proofing for future Nx versions
- update Ionic to 5.8.3
- update list starter template

## Bug Fixes

- fix styles asset path in workspace when generating an app on Windows

## BREAKING CHANGES

- Angular CLI is no longer officially supported

# 11.1.1

## Bug Fixes

- improve reliability of ESLint configuration

# 11.1.0

## Features

- update application starter templates
- support ESLint when generating applications
- generate applications with ESLint by default
- support `jest` as a unit test config for the application schematic

# 11.0.2

## Bug Fixes

- support Node 15 and npm 7

# 11.0.1

## Bug Fixes

- support Nx 11.3.0

# 11.0.0

## Features

- Nx 11 support (Nx 11 now required)
- update Ionic to 5.5.2
- add additional Ionic starter templates to application schematic
- support `none` as a unit test and e2e config for the application schematic

## Bug Fixes

- fix generating an application in a sub-directory with Capacitor enabled

# 1.1.0

## Features

- update Ionic to 5.5.1
