## @nxext/vue:application

Create a Vue application.

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
nx g @nxext/vue:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### directory

Type: `string`

A directory where the project is placed

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (E2E) tests.

#### inSourceTests

Default: `false`

Type: `boolean`

When using Vitest, separate spec files will not be generated and instead will be included within the source files. Read more on the Vitest docs site: https://vitest.dev/guide/in-source.html

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### rootProject (**hidden**)

Default: `false`

Type: `boolean`

Create a application at the root of the workspace

#### routing

Default: `false`

Type: `boolean`

Generate application with routes.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### skipNxJson

Default: `false`

Type: `boolean`

Skip updating `nx.json` with default options based on values provided to this app.

#### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

#### unitTestRunner

Default: `none`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.

## @nxext/vue:library

library generator

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
nx g @nxext/vue:library ...
```

Show what will be generated without writing to disk:

```bash
nx g library ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library that uses vite to bundle.

#### component

Default: `true`

Type: `boolean`

Generate a default component.

#### directory

Type: `string`

A directory where the project is placed

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (E2E) tests.

#### importPath

Type: `string`

The library name used to import it, like `@myorg/my-awesome-lib`.

#### inSourceTests

Default: `false`

Type: `boolean`

When using Vitest, separate spec files will not be generated and instead will be included within the source files. Read more on the Vitest docs site: https://vitest.dev/guide/in-source.html

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### publishable

Type: `boolean`

Create a publishable library.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

#### unitTestRunner

Default: `none`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.

## @nxext/vue:component

component generator

### Usage

```bash
nx generate component ...
```

```bash
nx g c ... # same
```

By default, Nx will search for `component` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vue:component ...
```

Show what will be generated without writing to disk:

```bash
nx g component ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### project (_**required**_)

Alias(es): p

Type: `string`

The name of the project.

#### directory

Type: `string`

A directory where the project is placed

#### export

Alias(es): e

Default: `true`

Type: `boolean`

When true, the component is exported from the project `index.ts` (if it exists).

#### skipTests

Default: `false`

Type: `boolean`

When true, does not create `spec.ts` test files for the new component.

## @nxext/vue:preset

preset generator

### Usage

```bash
nx generate preset ...
```

By default, Nx will search for `preset` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vue:preset ...
```

Show what will be generated without writing to disk:

```bash
nx g preset ... --dry-run
```

### Options

#### vueAppName (_**required**_)

Type: `string`

#### e2eTestRunner

Default: `none`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (E2E) tests.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### standalone

Default: `false`

Type: `boolean`

Generate a standalone project

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

#### tailwind

Default: `false`

Type: `boolean`

Setup Tailwind

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.

## @nxext/vue:storybook-configuration

storybook-configuration generator

### Usage

```bash
nx generate storybook-configuration ...
```

By default, Nx will search for `storybook-configuration` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vue:storybook-configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g storybook-configuration ... --dry-run
```

### Options

#### name (_**required**_)

Alias(es): project,projectName

Type: `string`

Project for which to generate Storybook configuration.

#### configureCypress

Default: `true`

Type: `boolean`

Run the cypress-configure generator.

#### configureStaticServe

Default: `true`

Type: `boolean`

Specifies whether to configure a static file server target for serving storybook. Helpful for speeding up CI build/test times.

#### configureTestRunner

Type: `boolean`

Add a Storybook Test-Runner target.

#### cypressDirectory

Type: `string`

A directory where the Cypress project will be placed. Placed at the root by default.

#### generateCypressSpecs

Default: `true`

Type: `boolean`

Automatically generate test files in the Cypress E2E app generated by the `cypress-configure` generator.

#### generateStories

Default: `true`

Type: `boolean`

Automatically generate `*.stories.ts` files for components declared in this project?

#### ignorePaths

Type: `array`

Paths to ignore when looking for components.

#### js

Default: `false`

Type: `boolean`

Generate JavaScript story files rather than TypeScript story files.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`

The tool to use for running lint checks.

#### tsConfiguration

Default: `false`

Type: `boolean`

Configure your project with TypeScript. Generate main.ts and preview.ts files, instead of main.js and preview.js.
