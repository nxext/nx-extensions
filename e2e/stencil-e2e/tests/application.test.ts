/**
 * Reference real-install e2e for @nxext/stencil application generator.
 *
 * Flow:
 *   1. globalSetup (tools/scripts/start-local-registry.ts) spins up Verdaccio,
 *      builds all @nxext/* plugins, and publishes them under the `e2e` npm tag.
 *   2. beforeAll scaffolds a fresh Nx workspace under `os.tmpdir()` (outside the
 *      host repo) and installs @nxext/stencil from the local registry.
 *   3. Each test generates a real application, runs a real `nx build`, and
 *      asserts the expected output files are present.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  runNxCommandAsync,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/stencil: application', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'stencil');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates and builds a stencil app (css)', async () => {
    const app = uniq('stencil-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --junitTestRunner=none --no-interactive`
    );

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${app} --dev`
    );
    expect(build.stdout).toContain('build finished');
    expect(() =>
      checkFilesExist(
        projectDirectory,
        `dist/apps/${app}/www/index.html`,
        `dist/apps/${app}/www/host.config.json`
      )
    ).not.toThrow();
  });

  it('builds with --prerender=true', async () => {
    const app = uniq('stencil-app-prerender');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --junitTestRunner=none --no-interactive`
    );

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${app} --prerender=true`
    );
    expect(build.stdout).toContain('build finished');
    expect(() =>
      checkFilesExist(
        projectDirectory,
        `dist/apps/${app}/www/index.html`,
        `dist/apps/${app}/www/host.config.json`
      )
    ).not.toThrow();
  });
});
