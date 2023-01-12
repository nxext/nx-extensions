## @nxext/vue:vue

vue generator

### Usage

```bash
nx generate vue ...
```

By default, Nx will search for `vue` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vue:vue ...
```

Show what will be generated without writing to disk:

```bash
nx g vue ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### directory

Type: `string`

A directory where the project is placed

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)
