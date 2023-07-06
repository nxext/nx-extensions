import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('capacitor-project e2e', () => {
  let projectDirectory: string;
  const plugin = uniq('capacitor');

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'capacitor');

    await runNxCommandAsync(
      `generate @nxext/capacitor:app ${plugin} --appId='io.ionic.starter'`
    );
    await runNxCommandAsync(
      `generate @nxext/capacitor:capacitor-project --project=${plugin}`
    );
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should build successfully', async () => {
    const buildResults = await runNxCommandAsync(`build ${plugin}`);
    expect(buildResults.stdout).toContain(
      `Successfully ran target build for project ${plugin}`
    );
  });

  it('should lint successfully', async () => {
    const lintResults = await runNxCommandAsync(`lint ${plugin}`);
    expect(lintResults.stdout).toContain('All files pass linting');
  });

  it('should run tests successfully', async () => {
    const testResults = await runNxCommandAsync(`test ${plugin}`);
    expect(testResults.stdout).toContain(
      `Successfully ran target test for project ${plugin}`
    );
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
