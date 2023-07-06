import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { rmSync } from 'fs';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';

describe('Ionic Angular Application', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'ionic-angular');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  describe('--template', () => {
    it('blank', async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template blank`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stdout).not.toContain('ERROR');

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).not.toContain('ERROR');
    });

    it('list', async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template list`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stdout).not.toContain('ERROR');

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).not.toContain('ERROR');
    });

    it('sidemenu', async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template sidemenu`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stdout).not.toContain('ERROR');

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).not.toContain('ERROR');
    });

    it('tabs', async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template tabs`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stdout).not.toContain('ERROR');

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).not.toContain('ERROR');
    });
  });

  describe('Ionic Angular Page', () => {
    it('should create page in project', async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false`
      );
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:page --name my-page --project ${appName}`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stdout).not.toContain('ERROR');
    });
  });

  it('e2e', async () => {
    const appName = uniq('ionic-angular');
    await runNxCommandAsync(
      `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template blank`
    );

    const e2eResults = await runNxCommandAsync(`e2e ${appName}-e2e`);
    expect(e2eResults.stdout).toContain('All specs passed!');
  });
});
