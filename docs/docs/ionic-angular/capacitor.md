By default, [Capacitor](https://capacitorjs.com/) is configured for a newly generated project. Typically you execute Capacitor commands with `ionic capacitor ...` or `npx --package=@capacitor/cli cap ...`. However, due to the way that Nx works, the Capacitor commands go through the Nx CLI.

## Add Native Platform

First, ensure that the frontend project has been built:

```
nx build {frontend project name}

nx build mobile-app
```

Now that a Capacitor project has been added to your Nx workspace you can begin adding support for native platforms. Currently, Capacitor supports Android and iOS, but other platforms can be added with Capacitor plugins.

```
nx run {frontend project}:add:ios
nx run {frontend project}:add:android
nx run {frontend project}:add --platform {native platform}

nx run my-app:add:android
```

## Copy Build Output

Copy the lastest build output to the native platforms:

```
nx run {frontend project}:copy:ios
nx run {frontend project}:copy:android
nx run {frontend project}:copy --platform {native platform}

nx run my-app:copy:android
```

## Sync Build Output and Dependencies

Copy the latest build output to the native platforms and sync native platform dependencies:

```
nx run {frontend project}:sync:ios
nx run {frontend project}:sync:android
nx run {frontend project}:sync --platform {native platform}

nx run my-app:sync:android
```

## Open Native Platform

Finally, you can open the native platform in it's respective IDE:

```
nx run {frontend project}:open:ios
nx run {frontend project}:open:android
nx run {frontend project}:open --platform {native platform}

nx run my-app:open:android
```

To learn more about using Capacitor with `@nxext/capacitor` then visit the [Getting Started](../capacitor/getting-started.md) page.
