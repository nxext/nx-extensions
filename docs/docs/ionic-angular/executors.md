# Executors

Following commands have been added to your `project.json` file

```
   "cap": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "--help"
      }
    },
    "add": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "add"
      },
      "configurations": {
        "ios": {
          "cmd": "add ios"
        },
        "android": {
          "cmd": "add android"
        }
      }
    },
    "copy": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "copy"
      },
      "configurations": {
        "ios": {
          "cmd": "copy ios"
        },
        "android": {
          "cmd": "copy android"
        }
      }
    },
    "open": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "open"
      },
      "configurations": {
        "ios": {
          "cmd": "open ios"
        },
        "android": {
          "cmd": "open android"
        }
      }
    },
    "run": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "run"
      },
      "configurations": {
        "ios": {
          "cmd": "run ios"
        },
        "android": {
          "cmd": "run android"
        }
      }
    },
    "sync": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "sync"
      },
      "configurations": {
        "ios": {
          "cmd": "sync ios"
        },
        "android": {
          "cmd": "sync android"
        }
      }
    },
    "update": {
      "executor": "@nxext/capacitor:cap",
      "options": {
        "cmd": "update"
      },
      "configurations": {
        "ios": {
          "cmd": "update ios"
        },
        "android": {
          "cmd": "update android"
        }
      }
    }
```

## Cap

`nx run my-app:cap` does list every capacitor available commands

## Add

`nx run my-app:add` add the native `android` and `ios` platforms

## Copy

Not used anymore

## Open

`nx run my-app:open` open the project inside `xcode` or `android studio`

## Run

`nx run my-app:run` run the project inside `xcode` or `android studio` and start directly the virtual screen

## sync

`nx run my-app:sync` copy your built web bundle of the [Capacitor Config](https://capacitorjs.com/docs/config) file to your native project and install the native project's dependencies.

## Update

`nx run my-app:update` update the plugin to a latest version
