import {
  cleanup,
  readJson,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
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
    cleanup();
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
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template blank`
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
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template list`
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
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu`
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
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template tabs`
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
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template sidemenu`
        );

        const e2eResults = await runNxCommandAsync(`e2e ${appName}-e2e`);
        expect(e2eResults.stdout).toContain('All specs passed!');
      },
      asyncTimeout
    );
  });

  describe('--directory', () => {
    it(
      'should create src in the specified directory',
      async () => {
        const options: ApplicationGeneratorSchema = {
          ...defaultOptions,
          name: uniq('ionic-react'),
          directory: 'subdir',
        };
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app ${options.name} --directory ${options.directory} --capacitor false`
        );
        const buildResults = await runNxCommandAsync(
          `build ${options.directory}-${options.name}`
        );
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(
          `lint ${options.directory}-${options.name}`
        );
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );
  });

  describe('--tags', () => {
    it(
      'should add tags to project configuration',
      async () => {
        const options: ApplicationGeneratorSchema = {
          ...defaultOptions,
          name: uniq('ionic-react'),
          tags: 'e2etag,e2ePackage',
        };
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app ${options.name} --tags ${options.tags} --capacitor false`
        );

        const projectConfiguration = readJson(
          `apps/${options.name}/project.json`
        );
        expect(projectConfiguration.tags).toEqual(['e2etag', 'e2ePackage']);

        const buildResults = await runNxCommandAsync(`build ${options.name}`);
        expect(buildResults.stderr).toBeFalsy();

        const lintResults = await runNxCommandAsync(`lint ${options.name}`);
        expect(lintResults.stdout).toContain('All files pass linting');
      },
      asyncTimeout
    );
  });
});
