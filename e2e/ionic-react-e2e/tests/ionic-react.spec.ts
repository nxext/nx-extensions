import { readJson, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { ApplicationGeneratorSchema } from '@nxext/ionic-react';
import { newProject } from '@nxext/e2e';

describe('application e2e', () => {
  const asyncTimeout = 300_000;

  beforeAll(() => {
    newProject(['@nxext/ionic-react']);
  });

  const defaultOptions: ApplicationGeneratorSchema = {
    name: 'test',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    template: 'blank',
    capacitor: false,
    skipFormat: false,
  };

  async function buildAndTestApp(plugin: string) {
    const buildResults = await runNxCommandAsync(`build ${plugin}`);
    expect(buildResults.stderr).toBeFalsy();

    const lintResults = await runNxCommandAsync(`lint ${plugin}`);
    expect(lintResults.stdout).toContain('All files pass linting');

    const testResults = await runNxCommandAsync(`test ${plugin}`);
    expect(testResults.stderr).toContain('1 passed');

    const e2eResults = await runNxCommandAsync(`e2e ${plugin}-e2e`);
    expect(e2eResults.stdout).toContain('All specs passed!');
  }

  describe('--template', () => {
    it(
      'blank',
      async () => {
        const appName = uniq('ionic-react');
        await runNxCommandAsync(
          `generate @nxext/ionic-react:app --name ${appName} --capacitor false --template blank`
        );

        await buildAndTestApp(appName);
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

        await buildAndTestApp(appName);
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

        await buildAndTestApp(appName);
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

        await buildAndTestApp(appName);
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
        await buildAndTestApp(`${options.directory}-${options.name}`);
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

        await buildAndTestApp(options.name);
      },
      asyncTimeout
    );
  });
});
