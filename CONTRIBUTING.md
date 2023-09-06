# Contributing to Nxext

PR's, ideas and discussions are welcome.

Always run `pnpm format` before doing a push!

## Project Structure

This project uses the Nx CLI with pnpm.

This project is built with Nx and follows the OSS project structure. The [Getting Started](https://nx.dev/getting-started) guide shows how to work with Nx workspaces.

## Build

After cloning the project, to install the dependencies, run:

```
pnpm install
```

To build a plugin, run:

```
pnpm build [plugin]
```

## Run the Unit Tests

Run unit tests for a specific plugin with:

```
pnpm test [plugin]
```

## Run the e2e Tests

Run e2e tests for a specific plugin with:

```
pnpm e2e [plugin]
```

## Test Locally

Create a playground Nx repository:

```
pnpm create-playground
```

This will create a playground repository inside the Nxext repository directory. You'll find it here:

> tmp/nx-playground/proj/

It is a regular Nx repository and you're able to do everything like create projects and libraries.

To update the playground with changes on the plugins without rebuilding a new playground, run:

```
pnpm update-playground
```

**Happy coding :-)**
