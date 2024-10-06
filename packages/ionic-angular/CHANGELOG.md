## 19.2.0 (2024-10-06)


### 🚀 Features

- update to nx 15.2.0 ([eb16e414](https://github.com/nxext/nx-extensions/commit/eb16e414))

- migrate to nx 16.6 ([f6daab02](https://github.com/nxext/nx-extensions/commit/f6daab02))

- **ionic-angular:** add ionic angular plugin ([79c5f7ac](https://github.com/nxext/nx-extensions/commit/79c5f7ac))

- **ionic-react:** add ionic-react plugin ([28e29a03](https://github.com/nxext/nx-extensions/commit/28e29a03))

- **nxext:** move from @nrwl/devkit to @nxext/devkit ([be72c863](https://github.com/nxext/nx-extensions/commit/be72c863))

- **nxext:** use own e2e test runner ([4f49ac9c](https://github.com/nxext/nx-extensions/commit/4f49ac9c))

- **nxext:** move from @nrwl/devkit to @nxext/devkit ([a96856fd](https://github.com/nxext/nx-extensions/commit/a96856fd))

- **nxext:** update to Nx 14.8.5 ([c657fc83](https://github.com/nxext/nx-extensions/commit/c657fc83))

- **ionic-angular:** update components to ionic 7 ([4d7b2f0a](https://github.com/nxext/nx-extensions/commit/4d7b2f0a))

- **ionic-react:** update to ionic 7 ([c2cdc8d4](https://github.com/nxext/nx-extensions/commit/c2cdc8d4))

- **nuxt:** add first alpha version plugin for nuxt ([94136e01](https://github.com/nxext/nx-extensions/commit/94136e01))

- **ionic-angular,capacitor:** replace app generator by a config generator ([03ee8840](https://github.com/nxext/nx-extensions/commit/03ee8840))

- **ionic-angular:** bump `@ionic/angular` to v8 ([baa8b31a](https://github.com/nxext/nx-extensions/commit/baa8b31a))


### 🩹 Fixes

- **nxext:** fix linting errors and add dependency linting ([303dd3f8](https://github.com/nxext/nx-extensions/commit/303dd3f8))

- **ionic-angular:** use the prefix for components ([b084cd97](https://github.com/nxext/nx-extensions/commit/b084cd97))

- **ionic-angular:** add missing capacitor plugins ([7b39d7df](https://github.com/nxext/nx-extensions/commit/7b39d7df))

- **ionic-angular:** resolve routes import correctly ([e447abc4](https://github.com/nxext/nx-extensions/commit/e447abc4))

- **ionic-angular:** move main.ts to src ([104065eb](https://github.com/nxext/nx-extensions/commit/104065eb))

- **ionic-angular:** update jest config to work with ionic ([91003d18](https://github.com/nxext/nx-extensions/commit/91003d18))

- **ionic-angular:** update jest config correctly ([b0a6ef82](https://github.com/nxext/nx-extensions/commit/b0a6ef82))


### 🧱 Updated Dependencies

- Updated capacitor to 19.2.0


### ❤️  Thank You

- Dominik Pieper @DominikPieper
- Edouard Bozon @edbzn
- Gion @gionkunz
- Jordan Hall @Jordan-Hall

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
