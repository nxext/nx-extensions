# Migrating from Nxtend to Nxext

The Nxext Ionic plugins support Nx 14, while the Nxtend plugins support Nx 13. In order to migrate to Nxext you must first upgrade your workspace to Nx 14. If you are using npm 6+ you will need to `npm install --legacy-peer-deps` in order to get passed npm errors. Once the workspace has been updated, the Ionic plugins will not work until they have been migrated to Nxext.

## Install Nxext Package

First, install the Nxext Ionic React package using your package manager of choice.

```
npm install -D @nxext/ionic-react
```

## Remove Nxtend Package

Finally, remove the Nxtend Ionic React package.

```
npm uninstall @nxtend/ionic-react
```

## Migrate Capacitor Plugin

If you are utilizing Capacitor in your application then you will need to migrate that plugin as well. See the [migration guide](../capacitor/migrating-from-nxtend.md).
