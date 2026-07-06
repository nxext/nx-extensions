/**
 * TS-solution counterpart to capacitor.spec.ts - see there for the
 * legacy-layout flow and the platform-smoke-test coverage (android
 * add/sync, cap executor). This suite scaffolds the same
 * `@nx/web:application` + `@nxext/capacitor:configuration` pipeline against
 * a workspace that is left in the (Nx 21+ default) TS-solution shape
 * (`createTestProject(name, { tsSolution: true })` - no downgrade to the
 * legacy apps-libs layout), to prove the `assertNotUsingTsSolutionSetup`
 * guard removal in
 * `packages/capacitor/src/generators/configuration/generator.ts` actually
 * holds end-to-end, not just against the synthetic tree in
 * `generator.spec.ts`.
 *
 * `@nx/web:application` fully supports TS-solution workspaces already
 * (verified directly against the installed `@nx/web` dist: it computes
 * `isUsingTsSolutionConfig` and registers the project as a package.json-based
 * project - no `project.json` - via `addProjectToTsSolutionWorkspace`), so
 * this can scaffold exactly like the legacy suite, just without the
 * downgrade step.
 *
 * `--name=${app}` is passed explicitly so the Nx project name is
 * deterministic: without it, `@nx/web:application` falls back to the
 * workspace's derived import path (e.g. `@proj/capacitor-ts...`) as the
 * project name in TS-solution mode, which would make `--project=` for the
 * capacitor generator depend on the workspace's npm scope. Directory
 * resolution itself ("as-provided", see `determineProjectNameAndRootOptions`)
 * is mode-independent - `packages/` below is used purely to signal the
 * TS-solution convention, not because it's required.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installNxPlugins,
  installPlugin,
  runNxCommandAsync,
  stripAnsi,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/capacitor (TS-solution)', () => {
  let projectDirectory: string;
  const app = uniq('capacitor-ts');
  const appRoot = `packages/${app}`;

  beforeAll(async () => {
    projectDirectory = createTestProject(app, { tsSolution: true });
    installNxPlugins(projectDirectory, ['@nx/web', '@nx/vite']);
    installPlugin(projectDirectory, 'capacitor');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/web:application ${appRoot} --name=${app} --style=css --bundler=vite --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/capacitor:configuration --project=${app} --appName=test --appId=test.example.app --skipFormat=true --no-interactive`
    );

    // Same defensive tsconfig patch as the legacy suite (see
    // capacitor.spec.ts): `@nx/web:application --bundler=vite --style=css`
    // generates a tsconfig.app.json whose `types` array fully overrides (not
    // merges with) the inherited one, so the plain CSS side-effect import in
    // the generated app.element.ts needs `vite/client`'s ambient `*.css`
    // module declaration added back in explicitly. The runtime tsconfig
    // filename (`tsconfig.app.json`) is the same in both modes -
    // `updateTsconfigFiles` (TS-solution mode) only changes the `extends`
    // chain, not the filename.
    const tsconfigAppPath = join(
      projectDirectory,
      `${appRoot}/tsconfig.app.json`
    );
    const tsconfigApp = JSON.parse(readFileSync(tsconfigAppPath, 'utf-8'));
    tsconfigApp.compilerOptions.types ??= [];
    if (!tsconfigApp.compilerOptions.types.includes('vite/client')) {
      tsconfigApp.compilerOptions.types.push('vite/client');
    }
    writeFileSync(tsconfigAppPath, JSON.stringify(tsconfigApp, null, 2));
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates capacitor.config.ts for the package.json-based project', () => {
    checkFilesExist(
      projectDirectory,
      `${appRoot}/capacitor.config.ts`,
      `${appRoot}/.gitignore`
    );
  });

  it('registers the project in pnpm-workspace.yaml (TS-solution registration untouched by capacitor)', () => {
    const workspaceYaml = readFileSync(
      join(projectDirectory, 'pnpm-workspace.yaml'),
      'utf-8'
    );
    expect(workspaceYaml).toContain('packages');
  });

  it('builds the capacitor-configured app', async () => {
    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  it('exposes the cap executor', async () => {
    const base = await runNxCommandAsync(projectDirectory, `run ${app}:cap`);
    expect(base.stdout).toContain('Usage');

    const help = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:cap --cmd="--help"`
    );
    expect(help.stdout).toContain('Usage: cap');
  });

  it('adds the android platform', async () => {
    const result = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:add:android`
    );
    expect(stripAnsi(result.stdout)).toContain(
      '[success] android platform added!'
    );
  });
});
