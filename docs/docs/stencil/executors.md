## @nxext/stencil:build

stencil build

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### ci

Default: `false`

Type: `boolean`

Run a build using recommended settings for a Continuous Integration (CI) environment. Defaults the number of workers to 4.

#### configPath

Type: `string`

Path to the stencil.config.ts file.

#### debug

Default: `false`

Type: `boolean`

Adds additional runtime code to help debug, and sets the log level for more verbose output.

#### dev

Default: `false`

Type: `boolean`

Runs a development build.

#### docsReadme

Default: `false`

Type: `boolean`

#### es5

Default: `false`

Type: `boolean`

#### log

Default: `false`

Type: `boolean`

Write logs for the stencil build into stencil-build.log. The log file is written in the same location as the config.

#### maxWorkers

Type: `number`

Max number of workers the compiler should use. Defaults to use the same number of CPUs the Operating System has available.

#### noOpen

Type: `boolean`

By default the --serve command will open a browser window. Using the --noOpen command will no automatically open a browser window.

#### port

Type: `number`

Max number of workers the compiler should use. Defaults to use the same number of CPUs the Operating System has available.

#### prerender

Default: `false`

Type: `boolean`

Prerender the application using the www output target after the build has completed.

#### prod

Default: `false`

Type: `boolean`

Runs a production build which will optimize each file, improve bundling, remove unused code, minify, etc. A production build is the default, this flag is only used to override the --dev flag.

#### projectType

Type: `string`

#### serve

Type: `boolean`

Starts the Integrated Dev Server.

#### ssr

Type: `boolean`

Starts the server side render process..

#### tsConfig

Type: `string`

The path to tsconfig file.

#### verbose

Type: `boolean`

Logs additional information about each step of the build.

#### watch

Type: `boolean`

Watches files during development and triggers a rebuild when files are updated.

## @nxext/stencil:test

stencil test

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### configPath

Type: `string`

Path to the stencil.config.ts file.

#### projectType

Type: `string`

#### watch

Type: `boolean`

## @nxext/stencil:e2e

stencil e2e

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### projectType

Type: `string`

## @nxext/stencil:serve

serve executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### ci

Default: `false`

Type: `boolean`

Run a build using recommended settings for a Continuous Integration (CI) environment. Defaults the number of workers to 4.

#### configPath

Type: `string`

Path to the stencil.config.ts file.

#### debug

Default: `false`

Type: `boolean`

Adds additional runtime code to help debug, and sets the log level for more verbose output.

#### dev

Default: `false`

Type: `boolean`

Runs a development build.

#### docsReadme

Default: `false`

Type: `boolean`

#### es5

Default: `false`

Type: `boolean`

#### log

Default: `false`

Type: `boolean`

Write logs for the stencil build into stencil-build.log. The log file is written in the same location as the config.

#### maxWorkers

Type: `number`

Max number of workers the compiler should use. Defaults to use the same number of CPUs the Operating System has available.

#### noOpen

Type: `boolean`

By default the --serve command will open a browser window. Using the --noOpen command will no automatically open a browser window.

#### port

Type: `number`

Max number of workers the compiler should use. Defaults to use the same number of CPUs the Operating System has available.

#### prerender

Default: `false`

Type: `boolean`

Prerender the application using the www output target after the build has completed.

#### prod

Default: `false`

Type: `boolean`

Runs a production build which will optimize each file, improve bundling, remove unused code, minify, etc. A production build is the default, this flag is only used to override the --dev flag.

#### projectType

Type: `string`

#### serve

Type: `boolean`

Starts the Integrated Dev Server.

#### ssr

Type: `boolean`

Starts the server side render process..

#### tsConfig

Type: `string`

The path to tsconfig file.

#### verbose

Type: `boolean`

Logs additional information about each step of the build.

#### watch

Type: `boolean`

Watches files during development and triggers a rebuild when files are updated.
