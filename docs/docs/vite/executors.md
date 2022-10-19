## @nxext/vite:build

build executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### baseHref

Type: `string`

Base url for the application being built.

#### configFile

Type: `string`

The path to vite.config.js file.

#### fileReplacements

Type: `object[]`

Replace files with other files in the build.

#### replace

Type: `string`

The file to be replaced.

#### with

Type: `string`

The file to replace with.

#### frameworkConfigFile (**hidden**)

Type: `string`

The path to vite.config.js for the framework.

#### outputPath

Type: `string`

The output path of the generated files.

#### sourcemaps

Default: `false`

Type: `boolean`

enable sourcemap

## @nxext/vite:dev

dev executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### baseHref

Type: `string`

Base url for the application being built.

#### configFile

Type: `string`

The path to vite.config.js file.

#### fileReplacements

Type: `object[]`

Replace files with other files in the build.

#### replace

Type: `string`

The file to be replaced.

#### with

Type: `string`

The file to replace with.

#### frameworkConfigFile (**hidden**)

Type: `string`

The path to vite.config.js for the framework.

#### outputPath

Type: `string`

The output path of the generated files.

#### proxyConfig

Type: `string`

Path to the proxy configuration file.

## @nxext/vite:package

Build package

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### entryFile (_**required**_)

Type: `string`

The name of the main entry-point file.

#### outputPath (_**required**_)

Type: `string`

The output path of the generated files.

#### assets

Type: `array`

List of static assets.

#### configFile

Type: `string`

Path to the vite config

#### external

Type: `array`

external libs

#### frameworkConfigFile (**hidden**)

Type: `string`

The path to vite.config.js for the framework.

#### packageJson

Type: `string`

The name of the package.json file
