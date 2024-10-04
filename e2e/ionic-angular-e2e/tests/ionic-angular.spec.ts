import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

const ansiEscapeCodeRegex = /\x1B\[[0-?]*[ -/]*[@-~]/g;

describe('ionic-angular-project e2e', () => {
  let projectDirectory: string;
  const app = uniq('ionic-angular');

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'ionic-angular');

    await runNxCommandAsync(
      `generate @nx/angular:application ${app} --style=css --minimal --e2eTestRunner=none --linter=none --projectNameAndRootFormat=derived --skipFormat=true`
    );
    await runNxCommandAsync(
      `generate @nxext/ionic-angular:configuration --project=${app} --appName=test --appId=test --skipFormat=true`
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
    const buildResults = await runNxCommandAsync(`build ${app}`);
    expect(buildResults.stdout.replace(ansiEscapeCodeRegex, '')).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  it('should run tests successfully', async () => {
    const testResults = await runNxCommandAsync(`test ${app}`);
    expect(testResults.stdout.replace(ansiEscapeCodeRegex, '')).toContain(
      `Successfully ran target test for project ${app}`
    );
  });

  it('should run cap successfully', async () => {
    const capResults = await runNxCommandAsync(`run ${app}:cap`);
    expect(capResults.stdout).toContain('Usage');

    const capPackageInstallResults = await runNxCommandAsync(
      `run ${app}:cap --packageInstall false`
    );
    expect(capPackageInstallResults.stdout).toContain('Usage: cap');

    const capHelpResults = await runNxCommandAsync(
      `run ${app}:cap --cmd="--help"`
    );
    expect(capHelpResults.stdout).toContain('Usage: cap');
  });
});
