import { cleanup, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';

describe('capacitor-project e2e', () => {
  const asyncTimeout = 600_000;

  const plugin = uniq('capacitor');

  beforeAll(async () => {
    newProject(['@nxext/capacitor'], ['@nrwl/react']);

    await runNxCommandAsync(
      `generate @nrwl/react:app ${plugin} --routing=false`
    );
    await runNxCommandAsync(
      `generate @nxext/capacitor:capacitor-project --project=${plugin}`
    );
  }, asyncTimeout);

  afterAll(() => cleanup());

  it('should build successfully', async () => {
    const buildResults = await runNxCommandAsync(`build ${plugin}`);
    expect(buildResults.stdout).toContain('compiled');
  });

  it('should lint successfully', async () => {
    const lintResults = await runNxCommandAsync(`lint ${plugin}`);
    expect(lintResults.stdout).toContain('All files pass linting');
  });

  it('should run tests successfully', async () => {
    const testResults = await runNxCommandAsync(`test ${plugin}`);
    expect(testResults.stderr).toContain('Ran all test suites');
  });

  it('should run e2e tests successfully', async () => {
    const e2eResults = await runNxCommandAsync(`e2e ${plugin}-e2e --headless`);
    expect(e2eResults.stdout).toContain('All specs passed!');
  });

  it('should run cap successfully', async () => {
    const capResults = await runNxCommandAsync(`run ${plugin}:cap`);
    expect(capResults.stdout).toContain('Usage');

    const capPackageInstallResults = await runNxCommandAsync(
      `run ${plugin}:cap --packageInstall false`
    );
    expect(capPackageInstallResults.stdout).toContain('Usage: cap');

    const capHelpResults = await runNxCommandAsync(
      `run ${plugin}:cap --cmd="--help"`
    );
    expect(capHelpResults.stdout).toContain('Usage: cap');
  });
});
