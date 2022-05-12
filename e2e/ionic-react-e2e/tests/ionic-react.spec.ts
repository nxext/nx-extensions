import {
  ensureNxProject,
  patchPackageJsonForPlugin,
  readJson,
  runNxCommandAsync,
  runPackageManagerInstall,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ApplicationGeneratorSchema } from '@nxext/ionic-react';

function ensureNxProjectWithDeps(
  npmPackageName?: string,
  pluginDistPath?: string,
  optionalNpmPackages?: [npmPackageName: string, pluginDistPath: string][]
): void {
  ensureNxProject(npmPackageName, pluginDistPath);
  optionalNpmPackages.forEach(([npmPackageName, pluginDistPath]) =>
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  );
  runPackageManagerInstall();
}

describe('application e2e', () => {
  const asyncTimeout = 300_000;

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
    expect(testResults.stderr).toContain('Test Suites: 1 passed, 1 total');

    const e2eResults = await runNxCommandAsync(`e2e ${plugin}-e2e`);
    expect(e2eResults.stdout).toContain('All specs passed!');
  }

  describe('--template', () => {
    it(
      'blank',
      async () => {
        const appName = uniq('ionic-react');
        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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
        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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
        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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
        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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

        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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

        ensureNxProjectWithDeps(
          '@nxext/ionic-react',
          'dist/packages/ionic-react',
          [['@nxext/capacitor', 'dist/packages/capacitor']]
        );
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
