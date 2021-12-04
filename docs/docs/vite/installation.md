---
id: installation
title: Installation
---

# Getting Started

At this current moment we don't have an out of the back workspace setup. In order to use nxext/vite you need to create a new NX workspace.

```bash
npx create-nx-workspace --preset=empty
```

After creating the blank workspace. Run the following commands

```bash npm2yarn
npm install @nxext/vite --save
```

## Generating scaffolding

## Init

```bash
npx nx g @nxext/vite:init
```

### Application

```bash
npx nx g @nxext/vite:app [name]
```

### Library

```bash
npx nx g @nxext/vite:lib [name]
```
