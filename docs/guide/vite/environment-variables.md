# Environment variables

## Vite way to go

First add a file named `env.d.ts` to your src directory with the following content:

```typescript
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Now you're ready to use the `.env` file in your workspace:

```
VITE_API_URL=http://localhost:3000/
```

After that, you can use the `import.meta.env` property to access the environment variables:

```
baseUrl: import.meta.env['VITE_API_URL'],
```
