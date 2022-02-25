# Getting Started

At this current moment we don't have an out of the back workspace setup. In order to use nxext/preact you need to create a new NX workspace.

```bash
npx create-nx-workspace --preset=empty
```

After creating the blank workspace. Run the following commands

```bash npm2yarn
npm install @nxext/preact --save
```

## Generating scaffolding

### Application

```bash
npx nx g @nxext/preact:app [name]
```

### Library

```bash
npx nx g @nxext/preact:lib [name]
```
