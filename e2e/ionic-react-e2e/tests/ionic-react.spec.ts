import { runNxCommand, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { ApplicationGeneratorSchema } from '@nxext/ionic-react';
import { newProject } from '@nxext/e2e';

describe('ionic react application e2e', () => {
  const asyncTimeout = 300_000;

  beforeAll(() => {
    newProject(['@nxext/ionic-react']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
  });

  const defaultOptions: ApplicationGeneratorSchema = {
    name: 'test',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    template: 'blank',
    capacitor: false,
    skipFormat: false,
  };

  describe('--template', () => {
    it(
      'blank',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template blank --bundler webpack`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );

    it(
      'list',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template list --bundler webpack`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );

    it(
      'sidemenu',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu --bundler webpack`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );

    it(
      'tabs',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template tabs --bundler webpack`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );

    it(
      'e2e',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu --bundler webpack`
        );

        const e2eResults = await runNxCommandAsync(`e2e ${appName}-e2e`);
        expect(e2eResults.stdout).toContain('All specs passed!');
      },
      asyncTimeout
    );
  });
});
