/**
 * Reference real-install e2e for @nxext/ionic-react. See stencil-e2e for flow.
 *
 * Layers its configuration on top of an `@nx/react:application` (vite + vitest).
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

describe('@nxext/ionic-react', () => {
  let projectDirectory: string;
  const app = uniq('ionic-react');

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installNxPlugins(projectDirectory, ['@nx/react', '@nx/vite']);
    installPlugin(projectDirectory, 'ionic-react');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/react:application apps/${app} --style=css --bundler=vite --unitTestRunner=vitest --minimal --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/ionic-react:configuration --project=${app} --appName=test --appId=test --skipFormat=true --no-interactive`
    );
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('builds the ionic-react-configured app', async () => {
    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  it('runs the app unit tests', async () => {
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
});
