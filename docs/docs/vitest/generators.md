## @nxext/vitest:init

init generator

### Usage

```bash
nx generate init ...
```

By default, Nx will search for `init` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vitest:init ...
```

Show what will be generated without writing to disk:

```bash
nx g init ... --dry-run
```

## @nxext/vitest:vitest-project

vitest-project generator

### Usage

```bash
nx generate vitest-project ...
```

By default, Nx will search for `vitest-project` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vitest:vitest-project ...
```

Show what will be generated without writing to disk:

```bash
nx g vitest-project ... --dry-run
```

### Options

#### project (_**required**_)

Type: `string`

#### framework

Default: `generic`

Type: `string`

Possible values: `generic`, `svelte`

Framework to use.
