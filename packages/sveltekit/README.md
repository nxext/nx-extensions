# @nxext/sveltekit

This library is experimental, be aware...

Right now there are the `app` and `component` generators.

## Getting Started

Add this plugin to an existing NX workspace:

```bash
yarn add --dev @nxext/sveltekit
```

or

```bash
npm install @nxext/sveltekit --save-dev
```

Generate a new application:

```bash
nx g @nxext/sveltekit:app my-app
```

## Run your project

> Note: you may see an error in your command line when you run any of the following commands with older versions of this extension: `config.kit.target is no longer required, and should be removed`. If you see this error, remove the `kit` object from your `svelte.config.js` file at the root of your app.

- Run `nx serve my-app` to run the app locally (open http://localhost:3000 in your browser)
- Run `nx test my-app` to test the app
- Run `nx build my-app` to create a build of your app.

## Documentation

The full docs can be found [here](https://nxext.dev/docs/sveltekit/overview).
