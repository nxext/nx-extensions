# Changelog

# 14.0.0

## Features

- generate applications with Ionic v6

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

## BREAKING CHANGES

- Angular CLI is no longer officially supported
- the `init` generator has been removed and the functionaltiy has been moved to the `application` schematic

# 11.0.3

## Bug Fixes

- support Node 15 and npm 7

# 11.0.2

## Bug Fixes

- support Nx 11.3.0

# 11.0.1

## Bug Fixes

- support `angular.json` as well as `workspace.json` during migrations

# 11.0.0

## Features

- Nx 11 support (Nx 11 now required)
- add additional Ionic starter templates to application schematic
- support custom Nx layouts
- update Ionic to 5.5.2

## Bug Fixes

- fix generating an application in a sub-directory with Capacitor enabled

## BREAKING CHANGES

- remove `classComponent` option from `application` schematic (now defaults to functional components)
- remove `style` option from the `application` schematic (now defaults to CSS)
- remove `pascalCaseComponent` option from the `application` schematic (now defaults to true)
- remove `skipFormat` option from the `application` schematic (now defaults to false)
- remove `linter` option from the `application` schematic (now defaults to ESLint)
- remove `js` option from the `application` schematic (now defaults to true)

# 4.1.0

- initialize plugin with `@nxext/capacitor` 2.0.2

# 4.0.0

# Features

- update Ionic to 5.4.1
- add `ionic.config.json` to application
- update starter template

# BREAKING CHANGES

- don't install and configure Cypress Testing Library
- removed `disableSanitizer` flag from `application` schematic

# 3.1.0

# Features

- update `@nxext/capacitor` to 1.1.0
- update Ionic to 5.3.2
- update Ionicons to 5.1.2
- update `@testing-library/cypress` to 7.0.0
- update `@testing-library/jest-dom` to 5.11.4
- update `@testing-library/user-event` to 12.1.5

# BREAKING CHANGES

- `@testing-library/cypress`
  - `get` and `query` queries (which have been deprecated) have now been removed. Use `find` queries only.
  - **TS**: TypeScript type definitions have been brought into this module and no longer needs to be referenced from DefinitelyTyped

# 3.0.5

## Bug Fixes

- improve null checks when updating `tsconfig.json` in application schematic to support Nx 10

# 3.0.4

## Bug Fixes

- fix `Collection @nx/react not found` error if `@nx/react` is not added manually

# 3.0.3

## Bug Fixes

- add `@nx/react` version based on the users Nx version
- don't unnecessarily add `@nxext/ionic-react` dependency in `init` schematic
- add `@nxext/capacitor` 1.0.0 instead of `*`

# 3.0.2

## Bug Fixes

- properly initialize Capacitor plugin

# 3.0.1

## Features

- upgrade Ionic to 5.2.3

# 3.0.0

## Features

- generate Capacitor project with application by default
- upgrade `@testing-library/jest-dom` to 5.11.0
- upgrade `@testing-library/user-event` to 12.0.11

## Breaking Changes

- `@testing-library/user-event` was upgraded two major versions ([11.0.0](https://github.com/testing-library/user-event/releases/tag/v12.0.0)) ([12.0.0](https://github.com/testing-library/user-event/releases/tag/v12.0.0))

# 2.2.0

## Bug Fixes

- fix pascal case generate App unit test
- fix generating global styles for Emotion

## Features

- upgrade Ionic to 5.2.2
- add `--disableSanitizer` flag to application schematic to disable the [Ionic sanitizer](https://ionicframework.com/docs/techniques/security#sanitizing-user-input)

# 2.1.0

## Bug Fixes

- fix styled-components styles

## Features

- generate applications with ESLint by default

# 2.0.0

## Features

- extend `@nx/react` schematics
- import `@testing-library/jest-dom` commands for unit tests
- upgrade `@testing-library/jest-dom` to 5.5.0
- upgrade `@testing-library/cypress` to 6.0.0
- upgrade `@testing-library/user-event` to 10.0.1
- honor `unitTestRunner` flag
- set `@nxext/ionic-react` as the default collection if one is not set when generating an application
- honor `skipFormat` flag
- update Ionic starter template
  - [#1201](https://github.com/ionic-team/starters/pull/1201)
  - [#1202](https://github.com/ionic-team/starters/pull/1202)
  - [#1237](https://github.com/ionic-team/starters/pull/1237)

# 1.0.2

## Bug Fixes

- fix home page style import for pascal file name generated apps

## Features

- upgrade Ionic to 5.0.7
