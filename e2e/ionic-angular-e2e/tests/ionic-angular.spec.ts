/**
 * Reference real-install e2e for @nxext/ionic-angular. See stencil-e2e for flow.
 *
 * Layers its configuration on top of an `@nx/angular:application`. We pin
 * `unitTestRunner=jest` because Nx 22's Angular default is vitest-angular,
 * which hard-gates against vitest >=4 and our workspace ships vitest 3.x.
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

describe('@nxext/ionic-angular', () => {
  let projectDirectory: string;
  const app = uniq('ionic-angular');

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installNxPlugins(projectDirectory, ['@nx/angular']);
    installPlugin(projectDirectory, 'ionic-angular');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/angular:application apps/${app} --style=css --minimal --unitTestRunner=jest --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/ionic-angular:configuration --project=${app} --appName=test --appId=test --skipFormat=true --no-interactive`
    );
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('builds the ionic-angular-configured app', async () => {
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
