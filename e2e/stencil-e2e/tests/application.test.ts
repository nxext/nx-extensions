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
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --no-interactive`
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

  // TODO: fails with Stencil's own `[ ERROR ] Please install supported
  // versions of dev dependencies... npm install --save-dev jest@29` even
  // though the generator correctly declares "jest": "^29.0.0" in the
  // generated package.json (see addPuppeteer / utils/typings.ts, verified
  // directly against the in-memory Tree — the declaration is correct and the
  // published tarball contains the fix). The real pnpm install in the
  // e2e-generated workspace still resolves the bare `jest` package to
  // something Stencil's internal check rejects — `jest-cli` and `@types/jest`
  // resolve fine at ^29.0.0, only plain `jest` doesn't, which points at some
  // other package in this workspace pulling in a newer jest transitively and
  // winning pnpm's resolution despite jest being a direct root devDependency.
  // Reproduced with both the e2eTestRunner default and --unitTestRunner=none
  // (ruling out @nx/jest's own init as the conflict source). Root cause not
  // isolated within @nxext/stencil's own generator code; unskip once found.
  it.skip('runs the default (puppeteer) e2e test runner', async () => {
    const app = uniq('stencil-app-e2e');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --no-interactive`
    );

    const e2e = await runNxCommandAsync(projectDirectory, `e2e ${app}`);
    expect(e2e.stdout).toContain('passed');
  });

  it('builds with --prerender=true', async () => {
    const app = uniq('stencil-app-prerender');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --no-interactive`
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
