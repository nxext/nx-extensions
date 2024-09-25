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
