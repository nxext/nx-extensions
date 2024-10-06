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
