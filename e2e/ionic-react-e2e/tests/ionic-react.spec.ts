import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('ionic react application e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'ionic-react');
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
      const appName = uniq('ionic-react');
      await runNxCommandAsync(
        `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template blank --bundler webpack`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stderr).toBeFalsy();

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).toContain('All files pass linting');
    });

    it('list', async () => {
      const appName = uniq('ionic-react');
      await runNxCommandAsync(
        `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template list --bundler webpack`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stderr).toBeFalsy();

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).toContain('All files pass linting');
    });

    it('sidemenu', async () => {
      const appName = uniq('ionic-react');
      await runNxCommandAsync(
        `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu --bundler webpack`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stderr).toBeFalsy();

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).toContain('All files pass linting');
    });

    it('tabs', async () => {
      const appName = uniq('ionic-react');
      await runNxCommandAsync(
        `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template tabs --bundler webpack`
      );

      const buildResults = await runNxCommandAsync(`build ${appName}`);
      expect(buildResults.stderr).toBeFalsy();

      const lintResults = await runNxCommandAsync(`lint ${appName}`);
      expect(lintResults.stdout).toContain('All files pass linting');
    });

    it('e2e', async () => {
      const appName = uniq('ionic-react');
      await runNxCommandAsync(
        `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu --bundler webpack`
      );

      const e2eResults = await runNxCommandAsync(`e2e ${appName}-e2e`);
      expect(e2eResults.stdout).toContain('All specs passed!');
    });
  });
});
