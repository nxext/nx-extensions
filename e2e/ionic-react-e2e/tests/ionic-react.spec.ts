import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin, stripAnsi } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('ionic-react-project e2e', () => {
  let projectDirectory: string;
  const app = uniq('ionic-react');
  const appDir = `apps/${app}`;

  beforeAll(async () => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'ionic-react');

    await runNxCommandAsync(
      `generate @nx/react:application ${appDir} --style=css --bundler=vite --unitTestRunner=vitest --minimal --e2eTestRunner=none --linter=none --skipFormat=true`
    );
    await runNxCommandAsync(
      `generate @nxext/ionic-react:configuration --project=${app} --appName=test --appId=test --skipFormat=true`
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
    expect(stripAnsi(buildResults.stdout)).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  it('should run tests successfully', async () => {
    const testResults = await runNxCommandAsync(`test ${app}`);
    expect(stripAnsi(testResults.stdout)).toContain(
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
