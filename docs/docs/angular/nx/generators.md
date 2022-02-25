---
sidebarDepth: 3
---

## @nxext/angular:application

Create an application

### Usage

```bash
nx generate application ...
```

```bash
nx g app ... # same
```

By default, Nx will search for `application` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/angular:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

The name of the application.

#### backendProject

Type: `string`

Backend project that provides data to this application. This sets up `proxy.config.json`.

#### directory

Type: `string`

The directory of the new application.

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `protractor`, `cypress`, `none`

Test runner to use for end to end (e2e) tests.

#### host

Type: `string`

The name of the host application that the remote application will be consumed by.

#### inlineStyle

Alias(es): s

Default: `false`

Type: `boolean`

Specifies if the style will be in the ts file.

#### inlineTemplate

Alias(es): t

Default: `false`

Type: `boolean`

Specifies if the template will be in the ts file.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### mfe

Default: `false`

Type: `boolean`

Generate a Module Federation configuration for the application

#### mfeType

Default: `remote`

Type: `string`

Possible values: `host`, `remote`

Type of application to generate the Module Federation configuration for.

#### port

Type: `number`

The port at which the remote application should be served.

#### prefix

Alias(es): p

Type: `string`

The prefix to apply to generated selectors.

#### remotes

Type: `array`

A list of remote application names that the host application should consume.

#### routing

Default: `false`

Type: `boolean`

Generate a routing module.

#### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

#### skipPackageJson

Default: `false`

Type: `boolean`

Do not add dependencies to `package.json`.

#### skipTests

Alias(es): S

Default: `false`

Type: `boolean`

Skip creating spec files.

#### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`.

#### strict

Default: `true`

Type: `boolean`

Create an application with stricter type checking and build optimization options.

#### style

Default: `css`

Type: `string`

Possible values: `css`

The file extension to be used for style files.

#### tags

Type: `string`

Add tags to the application (used for linting).

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `karma`, `jest`, `none`

Test runner to use for unit tests.

#### viewEncapsulation

Type: `string`

Possible values: `Emulated`, `Native`, `None`

Specifies the view encapsulation strategy.

## @nxext/angular:library

Create a library

### Usage

```bash
nx generate library ...
```

```bash
nx g lib ... # same
```

By default, Nx will search for `library` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/angular:library ...
```

Show what will be generated without writing to disk:

```bash
nx g library ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

The name of the library.

#### addModuleSpec

Default: `false`

Type: `boolean`

Add a module spec file.

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

#### compilationMode

Type: `string`

Possible values: `full`, `partial`

Specifies the compilation mode to use. If not specified, it will default to `partial` for publishable libraries and to `full` for buildable libraries. The `full` value can not be used for publishable libraries.

#### directory

Type: `string`

A directory where the library is placed.

#### importPath

Type: `string`

The library name used to import it, like `@myorg/my-awesome-lib`. Must be a valid npm name.

#### lazy

Default: `false`

Type: `boolean`

Add `RouterModule.forChild` when set to true, and a simple array of routes when set to false.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### parentModule

Type: `string`

Update the router configuration of the parent module using `loadChildren` or `children`, depending on what `lazy` is set to.

#### prefix

Alias(es): p

Type: `string`

The prefix to apply to generated selectors.

#### publishable

Default: `false`

Type: `boolean`

Generate a publishable library.

#### routing

Default: `false`

Type: `boolean`

Add router configuration. See `lazy` for more information.

#### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

#### simpleModuleName

Default: `false`

Type: `boolean`

Keep the module name simple (when using `--directory`).

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### skipPackageJson

Default: `false`

Type: `boolean`

Do not add dependencies to `package.json`.

#### skipTsConfig

Default: `false`

Type: `boolean`

Do not update `tsconfig.json` for development experience.

#### standaloneConfig

Default: `true`

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`.

#### strict

Default: `true`

Type: `boolean`

Create a library with stricter type checking and build optimization options.

#### tags

Type: `string`

Add tags to the library (used for linting).

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `karma`, `jest`, `none`

Test runner to use for unit tests.
