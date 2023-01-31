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

#### routing

Default: `false`

Type: `boolean`

Generate application with routes.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

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
