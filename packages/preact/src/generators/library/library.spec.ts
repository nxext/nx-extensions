import { PreactLibrarySchema } from './schema';
import { Linter } from '@nx/eslint';
import { readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './library';

describe('preact library schematic', () => {
  let host;
  const options: PreactLibrarySchema = {
    name: 'test',
    directory: 'libs/test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
    buildable: true,
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add preact project files', async () => {
    await libraryGenerator(host, options);
    expect(host.exists(`libs/test/project.json`)).toBeTruthy();
    expect(host.exists(`libs/test/package.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.lib.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.spec.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.json`)).toBeTruthy();
  });

  it('should not add package.json file when not buildable and publishable', async () => {
    await libraryGenerator(host, {
      ...options,
      buildable: false,
      publishable: false,
    });
    expect(host.exists(`libs/test/package.json`)).toBeFalsy();
  });

  it('should add preact dependencies', async () => {
    await libraryGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['preact']).toBeDefined();
  });

  it('should add lint config file', async () => {
    await libraryGenerator(host, options);
    expect(host.exists(`libs/test/eslint.config.js`)).toBeFalsy();
    expect(host.exists(`libs/test/.eslintrc.json`)).toBeTruthy();
  });

  xit('should add lint config file for the flat config', async () => {
    process.env.ESLINT_USE_FLAT_CONFIG = 'true';
    await libraryGenerator(host, options);
    expect(host.exists(`libs/test/eslint.config.js`)).toBeTruthy();
    expect(host.exists(`libs/test/.eslintrc.json`)).toBeFalsy();
    delete process.env.ESLINT_USE_FLAT_CONFIG;
  });

  it('should fail if no importPath is provided with publishable', async () => {
    try {
      await libraryGenerator(host, {
        ...options,
        publishable: true,
      });
    } catch (error) {
      expect(error.message).toContain(
        'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)'
      );
    }
  });
});
