/**
 * TS-solution e2e for @nxext/preact (P2-Phase-2, Design 3.4 / Teil B),
 * mirroring `svelte-e2e/tests/ts-solution.test.ts`.
 *
 * Unlike `preact.test.ts`, this suite scaffolds the test workspace with
 * `{ tsSolution: true }` (see `createTestProject` in `@nxext/e2e-utils`): the
 * workspace is NOT downgraded to the legacy apps-libs/project.json layout,
 * so it stays in the real, non-downgraded TS-solution shape (package-manager
 * workspaces, package.json-based projects, TS project references) that
 * ships by default since Nx 21/22.
 *
 * The workspace's npm scope is NOT `@proj` here (that's a
 * `create-nx-workspace` convention tied to older presets) - the current
 * `--preset=apps` scaffold maps to a template whose root package.json is
 * always named `@org/source` regardless of the workspace name passed on the
 * CLI. Every assertion below therefore reads the actually-generated
 * package.json `name` field back out instead of assuming any particular
 * scope string.
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

describe('@nxext/preact: TS-solution mode', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('proj', { tsSolution: true });
    installPlugin(projectDirectory, 'preact');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates a package.json-based app (no project.json) that builds and tests', async () => {
    const app = uniq('ts-solution-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/preact:app apps/${app} --unitTestRunner=vitest --e2eTestRunner=none --no-interactive`,
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

    // A freshly scaffolded app has no test files; give vitest something to
    // run (same flow as the legacy application suite / the svelte
    // ts-solution suite). Targeting the app (not a library) here never
    // touches the component generator's barrel-export logic, so it's safe
    // regardless of `project` type.
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/preact:component test --project=${appProjectName} --no-interactive`,
    );

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

    const testResult = await runNxCommandAsync(
      projectDirectory,
      `test ${appProjectName}`,
    );
    expect(stripAnsi(`${testResult.stdout}${testResult.stderr}`)).toContain(
      `Successfully ran target test for project ${appProjectName}`,
    );
  });

  it('registers the project in the package manager workspaces and the root tsconfig.json references', async () => {
    const app = uniq('ts-solution-registration');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/preact:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
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

  it('builds an app that imports a sibling lib via the workspace symlink (not tsconfig paths)', async () => {
    const app = uniq('ts-solution-link-app');
    const lib = uniq('ts-solution-link-lib');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/preact:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );
    // Deliberately NON-buildable: its generated package.json points main/
    // exports straight at `./src/index.ts`, so a successful app build proves
    // the lib's source was resolved through the package-manager symlink -
    // no tsconfig path alias, no prior lib build output involved.
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/preact:lib libs/${lib} --unitTestRunner=none --e2eTestRunner=none --no-interactive`,
    );

    const appPackageJson = readJson<{ name: string }>(
      projectDirectory,
      `apps/${app}/package.json`,
    );
    const libPackageJson = readJson<{
      name: string;
      main?: string;
      exports?: Record<string, unknown>;
    }>(projectDirectory, `libs/${lib}/package.json`);
    const appProjectName = appPackageJson.name;
    const importPath = libPackageJson.name;
    expect(libPackageJson.main).toBe('./src/index.ts');
    // objectContaining, not toEqual: in a real TS-solution workspace the
    // root tsconfig.base.json declares `customConditions` (named after the
    // root package, e.g. `@org/source`), and @nx/vite's configuration
    // generator adds that development condition to exports['.'] pointing at
    // the source too. That's desired Nx behavior - the contract this test
    // cares about is only that types/import/default resolve straight to
    // src (no dist step).
    expect(libPackageJson.exports?.['.']).toEqual(
      expect.objectContaining({
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      }),
    );

    // Written directly (not via the `component` generator): the component
    // generator's barrel-export re-export line for library targets uses a
    // `.ts` specifier for what is actually a generated `.tsx` file (a pre-
    // existing quirk, unrelated to TS-solution) - sidestep it entirely and
    // write a plain `.ts`-safe (non-JSX) preact function directly instead,
    // keeping this test focused on workspace-symlink resolution.
    updateFile(
      projectDirectory,
      `libs/${lib}/src/index.ts`,
      `import { h } from 'preact';

export function Greeting({ msg }: { msg: string }) {
  return h('p', null, msg);
}
`,
    );

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
      `import { Greeting } from '${importPath}';

function App() {
  return (
    <div>
      <Greeting msg="Yey" />
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
