## @nxext/vitest:vitest

vitest executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### passWithNoTests

Default: `false`

Type: `boolean`

Pass the build if no tests are found

#### testNamePattern

Type: `string`

Pattern to match test names

#### vitestMode

Default: `test`

Type: `string`

Possible values: `test`, `benchmark`
