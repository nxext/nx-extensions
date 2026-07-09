/**
 * TS-solution e2e for @nxext/sveltekit, modeled on
 * e2e/svelte-e2e/tests/ts-solution.test.ts.
 *
 * Unlike sveltekit.spec.ts, this suite scaffolds the test workspace with
 * `{ tsSolution: true }` (see `createTestProject` in `@nxext/e2e-utils`):
 * the workspace is NOT downgraded to the legacy apps-libs/project.json
 * layout, so it stays in the real, non-downgraded TS-solution shape
 * (package-manager workspaces, package.json-based projects, TS project
 * references) that ships by default since Nx 21/22.
 *
 * Scope is deliberately narrower than the svelte TS-solution suite: no
 * `nx build` assertions. The legacy sveltekit suite already skips its build
 * test because `@sveltejs/kit`'s `sveltekit()` Vite plugin captures
 * `process.cwd()` as a module-level constant, which breaks under `nx build`
 * running from the workspace root (see the detailed root-cause TODO on the
 * `it.skip('generates and builds a sveltekit app')` test in
 * sveltekit.spec.ts). That upstream bug is mode-independent, so this suite
 * sticks to generate + lint + structure assertions.
 *
 * Also note (mirroring sveltekit.spec.ts): the sveltekit app generator
 * takes a bare project name as positional + an optional `--directory` flag,
 * so generated projects land at the workspace root (`<app>/`), not under
 * `apps/` - unlike the svelte/solid/preact generators where `apps/<name>`
 * is the directory argument.
 *
 * The workspace's npm scope is NOT `@proj` here (that's a
 * `create-nx-workspace` convention tied to older presets) - the current
 * `--preset=apps` scaffold maps to a template whose root package.json is
 * always named `@org/source` regardless of the workspace name passed on the
 * CLI. Assertions below therefore read generated names back out instead of
 * assuming a particular scope string.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  readJson,
  readWorkspaceGlobs,
  runNxCommandAsync,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/sveltekit: TS-solution mode', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('proj', { tsSolution: true });
    installPlugin(projectDirectory, 'sveltekit');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates a package.json-based app (no project.json) with the expected structure', async () => {
    const app = uniq('sveltekit-ts-solution');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`,
    );

    // package.json-backed project instead of project.json.
    expect(() =>
      checkFilesExist(projectDirectory, `${app}/package.json`),
    ).not.toThrow();
    expect(() =>
      checkFilesExist(projectDirectory, `${app}/project.json`),
    ).toThrow();

    const appPackageJson = readJson<{
      name: string;
      type?: string;
      nx?: { name?: string; targets?: Record<string, unknown> };
    }>(projectDirectory, `${app}/package.json`);
    // sveltekit's schema requires an explicit `name`, so the registered Nx
    // project identifier is always the bare name; when the derived import
    // path (package.json `name`) differs, it's recorded via `nx.name`.
    expect(appPackageJson.nx?.name ?? appPackageJson.name).toBe(app);
    // svelte.config.js is ESM and its filename is a fixed SvelteKit
    // convention, so the project package.json must declare `type: "module"`.
    expect(appPackageJson.type).toBe('module');
    // The check/add targets move onto package.json's nx.targets for
    // package.json-backed projects.
    expect(appPackageJson.nx?.targets?.['check']).toBeDefined();
    expect(appPackageJson.nx?.targets?.['add']).toBeDefined();

    // SvelteKit app skeleton (mode-independent files).
    expect(() =>
      checkFilesExist(
        projectDirectory,
        `${app}/svelte.config.js`,
        `${app}/vite.config.ts`,
        `${app}/src/app.html`,
        `${app}/src/routes/+page.svelte`,
        `${app}/src/routes/+layout.svelte`,
        `${app}/tsconfig.json`,
        `${app}/tsconfig.app.json`,
        `${app}/tsconfig.spec.json`,
      ),
    ).not.toThrow();

    // TS-solution tsconfig chain: the wrapper tsconfig.json is a thin
    // references-only pointer (no legacy svelte compilerOptions - notably
    // no `importsNotUsedAsValues`, which is removed in TS >= 5.5), and the
    // runtime tsconfig.app.json extends the workspace tsconfig.base.json
    // directly (rewired by updateTsconfigFiles).
    const wrapperTsconfig = readJson<{
      compilerOptions?: Record<string, unknown>;
      references?: { path: string }[];
    }>(projectDirectory, `${app}/tsconfig.json`);
    expect(wrapperTsconfig.compilerOptions).toBeUndefined();
    expect(wrapperTsconfig.references).toEqual(
      expect.arrayContaining([
        { path: './tsconfig.app.json' },
        { path: './tsconfig.spec.json' },
      ]),
    );

    const appTsconfig = readJson<{ extends: string }>(
      projectDirectory,
      `${app}/tsconfig.app.json`,
    );
    expect(appTsconfig.extends).toBe('../tsconfig.base.json');
  });

  it('registers the project in the package manager workspaces and the root tsconfig.json references', async () => {
    const app = uniq('sveltekit-ts-registration');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`,
    );

    const workspaceGlobs = readWorkspaceGlobs(projectDirectory);
    expect(workspaceGlobs.some((glob) => glob.includes(app))).toBe(true);

    const rootTsconfig = readJson<{ references: { path: string }[] }>(
      projectDirectory,
      'tsconfig.json',
    );
    expect(rootTsconfig.references).toEqual(
      expect.arrayContaining([{ path: `./${app}` }]),
    );

    // TS-solution: no tsconfig.base.json paths entry gets registered -
    // cross-project resolution goes through the package-manager workspace
    // registration above instead.
    const tsconfigBase = readJson<{
      compilerOptions: { paths?: Record<string, string[]> };
    }>(projectDirectory, 'tsconfig.base.json');
    expect(
      Object.keys(tsconfigBase.compilerOptions.paths ?? {}).some((key) =>
        key.endsWith(app),
      ),
    ).toBe(false);
  });

  it('lints a generated app', async () => {
    const app = uniq('sveltekit-ts-lint');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`,
    );

    const result = await runNxCommandAsync(projectDirectory, `lint ${app}`);
    expect(result.stdout).toContain('All files pass linting');
  });
});
