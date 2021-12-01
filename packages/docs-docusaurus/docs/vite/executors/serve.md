---
id: serve
title: Serve
---

## Usage

```
nx serve my-app
```

### --configFile

Type: `string`

The path to vite.config.js file.

### --proxyConfig

Type: `string`

The path to proxy.conf.json file.

#### Examples

```json
{
  "/foo": "http://localhost:4567",
  "/api": {
    "target": "http://jsonplaceholder.typicode.com",
    "changeOrigin": true
  }
}
```
