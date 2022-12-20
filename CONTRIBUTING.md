# Contributing to Nxext

PR's, ideas and discussions are welcome.

Always run `yarn format` before doing a push!

## Project Structure

This project uses the Nx CLI with Yarn 1.x.

This project is built with Nx and follows the OSS project structure. The [Getting Started](https://nx.dev/angular/getting-started/what-is-nx) guide shows how to work with Nx workspaces.

## Build

After cloning the project, to install the dependencies, run:

```
yarn
```

To build a plugin, run:

```
yarn build [plugin]
```

## Run the Unit Tests

Run unit tests for a specific plugin with:

```
yarn test [plugin]
```

## Run the e2e Tests

Run e2e tests for a specific plugin with:

```
yarn e2e [plugin]
```

## Test Locally

Create a playground Nx repository:

```
yarn create-playground
```

This will create a playground repository inside the Nxext repository directory. You'll find it here:

> tmp/nx-playground/proj/

It is a regular Nx repository and you're able to do everything like create projects and libraries.

To update the playground with changes on the plugins without rebuilding a new playground, run:

```
yarn update-playground
```

## Publishing to a local registry

To test if your changes will actually work once the changes are published,
it can be useful to publish to a local registry.

```bash
# Starts the local registry. Keep this running in a separate terminal.
yarn local-registry start

# Set npm and yarn to use the local registry.
# Note: This reroutes your installs to your local registry
yarn local-registry enable

# Revert npm and yarn to use their default registries
yarn local-registry disable
```

To publish packages to a local registry, do the following:

- Run `yarn local-registry start` in Terminal 1 (keep it running)
- Run `npm adduser --registry http://localhost:4873` in Terminal 2 (real credentials are not required, you just need to be logged in. You can use test/test/test@test.io.)
- Run `yarn local-registry enable` in Terminal 2
- Run `yarn local-release 999.9.9` in Terminal 2

**Happy coding :-)**
