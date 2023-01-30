import { SolidLibrarySchema } from './schema';
import { Linter } from '@nrwl/linter';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from './library';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nrwl/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../init/lib/util');

describe('solid library schematic', () => {
  let host: Tree;
  const options: SolidLibrarySchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
  };
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add solid dependencies', async () => {
    await libraryGenerator(host, options);
    const packageJson = readJson(host, 'package.json');

    expect(packageJson.devDependencies['solid-js']).toBeDefined();
    expect(packageJson.devDependencies['solid-jest']).toBeDefined();
  });

  it('should add solid project files', async () => {
    await libraryGenerator(host, options);

    expect(host.exists(`libs/${options.name}/tsconfig.lib.json`)).toBeTruthy();
    expect(host.exists(`libs/${options.name}/tsconfig.spec.json`)).toBeTruthy();
    expect(host.exists(`libs/${options.name}/tsconfig.json`)).toBeTruthy();
    expect(host.exists(`libs/${options.name}/.eslintrc.json`)).toBeTruthy();
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
