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

  // TODO: fails with "Must use import to load ES Module" on
  // @angular/core/fesm2022/core.mjs inside jest-preset-angular's zoneless
  // setup-env, but ONLY in the real e2e install — an isolated repro (same
  // @angular/core@21.2.17, jest@30.3.0, jest-preset-angular@16.0.0, and the
  // exact jest.config.cts our updateJestConfig() produces, verified via
  // debug logging) passes every time. Angular went ESM-only-core in 21.x and
  // jest-preset-angular hasn't fully caught up; this looks like an ecosystem
  // gap triggered by some node_modules resolution detail specific to the
  // full @nxext/ionic-angular + @nxext/capacitor install that a from-scratch
  // repro doesn't reproduce. Unskip once jest-preset-angular ships a fix, or
  // if you find the actual trigger.
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
});
