/**
 * TS-solution e2e for @nxext/solid (mirrors e2e/svelte-e2e/tests/ts-solution.test.ts).
 *
 * Unlike solid.test.ts, this suite scaffolds the test workspace with
 * `{ tsSolution: true }` (see `createTestProject` in `@nxext/e2e-utils`): the
 * workspace is NOT downgraded to the legacy apps-libs/project.json layout, so
 * it stays in the real, non-downgraded TS-solution shape (package-manager
 * workspaces, package.json-based projects, TS project references) that ships
 * by default since Nx 21/22.
 *
 * The workspace's npm scope is NOT `@proj` here (that's a `create-nx-workspace`
 * convention tied to older presets) - the current `--preset=apps` scaffold
 * maps to a template whose root package.json is always named `@org/source`
 * regardless of the workspace name passed on the CLI. Every assertion below
 * therefore reads the actually-generated package.json `name` field back out
 * instead of assuming any particular scope string.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  readJson,
  readWorkspaceGlobs,
  runCommand,
  runNxCommandAsync,
  stripAnsi,
  uniq,
  updateFile,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/solid: TS-solution mode', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('proj', { tsSolution: true });
    installPlugin(projectDirectory, 'solid');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates a package.json-based app (no project.json) that builds and lints', async () => {
    const app = uniq('ts-solution-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/solid:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );

    expect(() =>
      checkFilesExist(projectDirectory, `apps/${app}/package.json`),
    ).not.toThrow();
    expect(() =>
      checkFilesExist(projectDirectory, `apps/${app}/project.json`),
    ).toThrow();

    // TS-solution: no explicit --name was given, so the registered Nx
    // project identifier is the resolved import path (package.json name),
    // not the bare directory basename `app`.
    const appPackageJson = readJson<{ name: string }>(
      projectDirectory,
      `apps/${app}/package.json`,
    );
    const appProjectName = appPackageJson.name;

    const buildResult = await runNxCommandAsync(
      projectDirectory,
      `build ${appProjectName}`,
    );
    expect(stripAnsi(`${buildResult.stdout}${buildResult.stderr}`)).toContain(
      `Successfully ran target build for project ${appProjectName}`,
    );
    // TS-solution convention (@nx/vite branches on isUsingTsSolutionSetup):
    // build output goes into the project-local `dist`, not the workspace-
    // level `dist/apps/...` used by the legacy layout.
    expect(() =>
      checkFilesExist(projectDirectory, `apps/${app}/dist/index.html`),
    ).not.toThrow();

    const lintResult = await runNxCommandAsync(
      projectDirectory,
      `lint ${appProjectName}`,
    );
    expect(lintResult.stdout).toContain('All files pass linting');
  });

  it('registers the project in the package manager workspaces and the root tsconfig.json references', async () => {
    const app = uniq('ts-solution-registration');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/solid:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );

    const workspaceGlobs = readWorkspaceGlobs(projectDirectory);
    expect(workspaceGlobs.some((glob) => glob.includes('apps'))).toBe(true);

    const rootTsconfig = readJson<{ references: { path: string }[] }>(
      projectDirectory,
      'tsconfig.json',
    );
    expect(rootTsconfig.references).toEqual(
      expect.arrayContaining([{ path: `./apps/${app}` }]),
    );
  });

  it('wires the runtime tsconfig.app.json with Solid JSX support', async () => {
    const app = uniq('ts-solution-tsconfig');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/solid:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );

    // `jsx`/`jsxImportSource` normally live on the per-project wrapper
    // tsconfig.json (Solid's legacy-mode home for these settings) - but
    // `wireTsSolutionProject` repoints tsconfig.app.json's `extends`
    // straight at the root tsconfig.base.json, bypassing that wrapper. They
    // must therefore show up directly on tsconfig.app.json instead, or Solid
    // JSX/TSX files would fail to type-check.
    const tsconfigApp = readJson<{
      extends: string;
      compilerOptions: { jsx?: string; jsxImportSource?: string };
    }>(projectDirectory, `apps/${app}/tsconfig.app.json`);
    expect(tsconfigApp.extends).toBe('../../tsconfig.base.json');
    expect(tsconfigApp.compilerOptions.jsx).toBe('preserve');
    expect(tsconfigApp.compilerOptions.jsxImportSource).toBe('solid-js');
  });

  it('builds an app that imports a sibling lib via the workspace symlink (not tsconfig paths)', async () => {
    const app = uniq('ts-solution-link-app');
    const lib = uniq('ts-solution-link-lib');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/solid:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );
    // Deliberately NON-buildable: its generated package.json points main/
    // exports straight at `./src/index.ts`, so a successful app build proves
    // the lib's source was resolved through the package-manager symlink -
    // no tsconfig path alias, no prior lib build output involved.
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/solid:lib libs/${lib} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );

    const appPackageJson = readJson<{ name: string }>(
      projectDirectory,
      `apps/${app}/package.json`,
    );
    const libPackageJson = readJson<{ name: string; main?: string }>(
      projectDirectory,
      `libs/${lib}/package.json`,
    );
    const appProjectName = appPackageJson.name;
    const importPath = libPackageJson.name;
    expect(libPackageJson.main).toBe('./src/index.ts');

    // Export a symbol directly from the lib's entry point rather than
    // generating a component through `solid:c`: that generator's barrel
    // export currently references the generated `.tsx` component file with
    // a `.ts` extension (a pre-existing bug unrelated to TS-solution
    // support, reproducible in legacy mode too) which a bundler cannot
    // resolve - orthogonal to what this test is actually proving.
    updateFile(
      projectDirectory,
      `libs/${lib}/src/index.ts`,
      `export function greet(): string {
  return 'hello from ${lib}';
}
`,
    );

    // TS-solution: proves the actual point of this suite - no
    // tsconfig.base.json paths entry gets registered for the lib. Cross-
    // project resolution goes through the package-manager workspace
    // symlink (node_modules/<importPath> -> libs/<lib>) instead.
    const tsconfigBase = readJson<{
      compilerOptions: { paths?: Record<string, string[]> };
    }>(projectDirectory, 'tsconfig.base.json');
    expect(
      Object.keys(tsconfigBase.compilerOptions.paths ?? {}).some((key) =>
        key.endsWith(`/${lib}`),
      ),
    ).toBe(false);

    // pnpm (unlike npm workspaces) only links workspace packages that a
    // consumer actually declares - declaring the dep and re-installing IS
    // the TS-solution consumption model this test is about.
    // --no-frozen-lockfile: the e2e env sets CI=true, which flips pnpm's
    // install default to --frozen-lockfile - and the workspace:* dep we
    // just added is of course not in the lockfile yet.
    updateFile(projectDirectory, `apps/${app}/package.json`, (current) => {
      const json = JSON.parse(current);
      json.dependencies = {
        ...(json.dependencies ?? {}),
        [importPath]: 'workspace:*',
      };
      return JSON.stringify(json, null, 2);
    });
    runCommand(projectDirectory, 'pnpm install --no-frozen-lockfile');

    updateFile(
      projectDirectory,
      `apps/${app}/src/App.tsx`,
      `import { greet } from '${importPath}';

function App() {
  return (
    <div>
      <p>{greet()}</p>
    </div>
  );
}

export default App;
`,
    );

    const result = await runNxCommandAsync(
      projectDirectory,
      `build ${appProjectName}`,
    );
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${appProjectName}`,
    );
  });
});
