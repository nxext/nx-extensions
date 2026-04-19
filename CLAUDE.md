# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Nx monorepo that publishes a family of Nx plugins (`@nxext/*`) for non-Angular frameworks: `capacitor`, `ionic-angular`, `ionic-react`, `stencil`, `svelte`, `sveltekit`, `solid`, `preact`, plus a shared `common` library. Plugin majors track the supported Nx major — e.g. `21.x` of a plugin requires Nx `21.x`.

Package manager: **pnpm** (pinned via `packageManager` in root `package.json`). Node version in `.node-version`. Always run `pnpm format` before pushing (enforced in `CONTRIBUTING.md`).

## Workspace layout

`nx.json` overrides the default Nx layout:

- `packages/*` — the publishable plugin libraries (`libsDir`).
- `e2e/*` — the end-to-end test projects (`appsDir`), one per plugin. Each has `implicitDependencies: [<plugin>]`.
- `docs/` — VitePress site (`pnpm start:docs`).
- `tools/scripts/` — playground, local-registry, version-bump, and documentation scripts.
- `tsconfig.base.json` defines `@nxext/*` path aliases that resolve to each package's `src/index.ts`.

Each plugin package follows the standard Nx plugin shape: `generators.json`, `executors.json` (with a separate `builders`/`executors` split for legacy compat — the `compat` files are the `builders` entries), `migrations.json`, `src/generators/`, `src/executors/`, and `src/index.ts` re-exporting public generator factories. Shared generator/AST/path utilities live in `packages/common` and should be reused instead of duplicated.

## Common commands

Build / test / lint a single plugin (target runs against the Nx project name, which matches the dir name):

```
pnpm build stencil         # nx build stencil
pnpm test stencil          # nx test stencil
pnpm lint stencil
pnpm e2e stencil-e2e       # runs the e2e project, not the plugin
```

Run a single unit test file / test name (forwarded to Jest):

```
pnpm nx test stencil --testFile=some.spec.ts
pnpm nx test stencil -t "generates application"
```

Affected-only variants (what CI uses):

```
pnpm affected --target build lint test --exclude="tag:e2e"
```

Formatting / release / misc:

```
pnpm format                # nx format:write — REQUIRED before pushing
pnpm nx release            # conventional-commits-driven, per-package (see nx.json "release")
pnpm documentation         # regenerates schema docs from generators/executors
```

## Local testing workflow

There are two ways to exercise plugin changes locally; pick based on what you're doing:

1. **Playground** (interactive, for generator/executor smoke testing):

   ```
   pnpm create-playground      # builds all publishable libs, scaffolds tmp/nx-playground/proj
   pnpm update-playground      # re-copies built dists into the existing playground
   ```

   Publishable libs are detected via `getPublishableLibNames` in `tools/scripts/utils.ts` (criterion: `projectType === 'library'` AND `build.executor === '@nx/js:tsc'`). The playground's `package.json` points `@nxext/*` devDependencies at `file:` paths into `dist/packages/*`.

2. **Verdaccio local registry** (matches what CI e2e does): each e2e project's `jest.config.ts` wires `globalSetup` to `tools/scripts/start-local-registry.ts`, which runs `releaseVersion({ specifier: '0.0.1-e2e' })`, `nx run-many -t build`, and `releasePublish({ tag: 'e2e' })` against the `nxext:local-registry` Verdaccio target (port 4873, storage in `tmp/local-registry/storage`). E2e projects then `pnpm install @nxext/<name>@e2e` into a freshly-scaffolded `tmp/nx-e2e/proj` workspace via `createTestProject` / `installPlugin` in `e2e/utils/index.ts`. When writing new e2e specs, use these helpers rather than rolling your own scaffolding.

## Architectural conventions to respect

- **Module boundaries and dependency checks are enforced by ESLint** (`eslint.config.js`): `@nx/enforce-module-boundaries` on TS/JS and `@nx/dependency-checks` on every `package.json` / `project.json`. If you add a runtime import from another `packages/*` or an npm dep, also add it to that package's `package.json` `dependencies` — otherwise lint fails.
- **Generator conventions**: use `@nx/devkit` helpers (`generateFiles`, `names`, `offsetFromRoot`, `formatFiles`, `runTasksInSerial`) and `determineProjectNameAndRootOptions` / `ensureRootProjectName` from `@nx/devkit/src/generators/project-name-and-root-utils` for project name + root resolution. Call `assertNotUsingTsSolutionSetup` where applicable. Don't hand-roll these.
- **Release model**: `nx.json` sets `release.projects: ["packages/*"]` with `projectsRelationship: "independent"` and `version.conventionalCommits: true`. Every plugin has its own `CHANGELOG.md` and versions independently — commit messages matter (use `pnpm commit` / commitizen for the prompt-driven flow).
- **CI** (`.github/workflows/ci.yml`) runs via Nx Cloud with 3 agents; e2e is currently _excluded_ (`--exclude="tag:e2e"`). Don't assume e2e is green in CI — run it locally if you changed generator output.
