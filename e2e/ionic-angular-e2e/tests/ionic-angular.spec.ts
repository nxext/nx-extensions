import {
  cleanup,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';
import { newProject } from '@nxext/e2e';

describe('Ionic Angular Application', () => {
  const asyncTimeout = 600_000;

  beforeAll(() => {
    newProject(['@nxext/ionic-angular']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  describe('--template', () => {
    it(
      'blank',
      async () => {
        const appName = uniq('ionic-angular');
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template blank --verbose`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stdout).not.toContain('ERROR');

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).not.toContain('ERROR');
      },
      asyncTimeout
    );

    it(
      'list',
      async () => {
        const appName = uniq('ionic-angular');
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template list --verbose`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stdout).not.toContain('ERROR');

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).not.toContain('ERROR');
      },
      asyncTimeout
    );

    it(
      'sidemenu',
      async () => {
        const appName = uniq('ionic-angular');
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template sidemenu --verbose`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stdout).not.toContain('ERROR');

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).not.toContain('ERROR');
      },
      asyncTimeout
    );

    it(
      'tabs',
      async () => {
        const appName = uniq('ionic-angular');
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template tabs --verbose`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stdout).not.toContain('ERROR');

        const lintResults = await runNxCommandAsync(`lint ${appName}`);
        expect(lintResults.stdout).not.toContain('ERROR');
      },
      asyncTimeout
    );
  });

  xdescribe('Ionic Angular Page', () => {
    it(
      'should create page in project',
      async () => {
        const appName = uniq('ionic-angular');
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:app --name ${appName} --capacitor false`
        );
        await runNxCommandAsync(
          `generate @nxext/ionic-angular:page --name my-page --project ${appName}`
        );

        const buildResults = await runNxCommandAsync(`build ${appName}`);
        expect(buildResults.stdout).not.toContain('ERROR');
      },
      asyncTimeout
    );

    describe('--directory', () => {
      it(
        'should create page in directory',
        async () => {
          const appName = uniq('ionic-angular');
          await runNxCommandAsync(
            `generate @nxext/ionic-angular:app --name ${appName} --capacitor false`
          );
          await runNxCommandAsync(
            `generate @nxext/ionic-angular:page --name my-page --project ${appName} --directory my-dir`
          );

          const buildResults = await runNxCommandAsync(`build ${appName}`);
          expect(buildResults.stdout).not.toContain('ERROR');
        },
        asyncTimeout
      );
    });
  });

  xit(
    'e2e',
    async () => {
      const appName = uniq('ionic-angular');
      await runNxCommandAsync(
        `generate @nxext/ionic-angular:app --name ${appName} --capacitor false --template blank`
      );

      const e2eResults = await runNxCommandAsync(`e2e ${appName}-e2e`);
      expect(e2eResults.stdout).toContain('All specs passed!');
    },
    asyncTimeout
  );
});
