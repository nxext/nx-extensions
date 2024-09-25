# Migration

# 1.x.x - 2.0.0

## Move Capacitor Configs

With `@nxext/capacitor` 2.0+, Capacitor configurations will be added to the associated frontend project instead of creating a dedicated Capacitor project. Migrating to this new paradigm is trivial and takes just a few steps.

First, add a new set of Capacitor configs to your frontend project.

```
nx g @nxext/capacitor:capacitor-project --project my-app
```

Move `capacitor.config.json` from the Capacitor project to the root of the associated frontend project. You will have to overwrite the `capacitor.config.json` that was just generated.

Move all platform folders (`android`, `ios`, `electron`) from the Capacitor project to the root of the frontend project.

You should now test the Capacitor commands for the frontend project and ensure the project works as expected.

```
nx run my-app:sync --platform ios
nx run my-app:open --platform ios
```

If everything works as expected then you can safely remove the Capacitor project.

```
nx g @nx/workspace:remove my-app
```

The `@capacitor/cli` dependency in the root `package.json` is also no longer needed and can be removed.
