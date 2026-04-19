/**
 * Reference real-install e2e for @nxext/capacitor. See stencil-e2e for flow overview.
 *
 * Unlike the framework plugins, @nxext/capacitor layers its configuration on
 * top of an already-generated `@nx/web:application`, so beforeAll does both.
 */
import {
  cleanupTestProject,
  createTestProject,
  installNxPlugins,
  installPlugin,
  runNxCommandAsync,
  stripAnsi,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/capacitor', () => {
  let projectDirectory: string;
  const app = uniq('capacitor');

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installNxPlugins(projectDirectory, ['@nx/web', '@nx/vite']);
    installPlugin(projectDirectory, 'capacitor');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/web:application apps/${app} --style=css --bundler=vite --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/capacitor:configuration --project=${app} --appName=test --appId=test.example.app --skipFormat=true --no-interactive`
    );
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('builds the capacitor-configured app', async () => {
    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  // TODO: `@nx/web:application --e2eTestRunner=none` no longer registers a
  // `test` target in Nx 22; the capacitor configuration doesn't add one
  // either. Unskip once either side regains a default test target.
  it.skip('runs the app unit tests', async () => {
    const result = await runNxCommandAsync(projectDirectory, `test ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target test for project ${app}`
    );
  });

  it('exposes the cap executor', async () => {
    const base = await runNxCommandAsync(projectDirectory, `run ${app}:cap`);
    expect(base.stdout).toContain('Usage');

    const noInstall = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:cap --packageInstall false`
    );
    expect(noInstall.stdout).toContain('Usage: cap');

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

  it('syncs the android platform', async () => {
    const result = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:sync:android`
    );
    expect(stripAnsi(result.stdout)).toContain('✔ update android');
  });

  // TODO: requires Xcode + iOS toolchain; skipped for CI-portable runs. Unskip
  // only on a dedicated macOS runner with `sudo xcode-select --install` done.
  it.skip('adds the ios platform', async () => {
    const result = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:add:ios`
    );
    expect(stripAnsi(result.stdout)).toContain('[success] ios platform added!');
  });

  // TODO: depends on the ios-add test; same Xcode requirement.
  it.skip('syncs the ios platform', async () => {
    const result = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:sync:ios`
    );
    expect(stripAnsi(result.stdout)).toContain('✔ update ios');
  });
});
