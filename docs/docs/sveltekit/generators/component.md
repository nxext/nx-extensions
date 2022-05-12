## @nxext/sveltekit:component

component generator

### Usage

```bash
nx generate component ...
```

By default, Nx will search for `component` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/sveltekit:component ...
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

Project where the component is generated

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
