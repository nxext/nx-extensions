import { PreactLibrarySchema } from './schema';
import { Linter } from '@nrwl/linter';
import { readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from './library';

describe('preact library schematic', () => {
  let tree;
  const options: PreactLibrarySchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.overwrite(
      'package.json',
      `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nrwl/workspace": "0.0.0"
        }
      }
    `
    );
  });

  it('should add preact dependencies', async () => {
    await libraryGenerator(tree, options);
    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['preact']).toBeDefined();
  });

  it('should add preact project files', async () => {
    await libraryGenerator(tree, options);

    // expect(tree.exists(`libs/${options.name}/preact.config.cjs`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/tsconfig.lib.json`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/tsconfig.spec.json`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/tsconfig.json`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/.eslintrc.json`)).toBeFalsy();
    expect(tree.exists(`libs/${options.name}/.eslintrc.js`)).toBeTruthy();
  });

  it('should fail if no importPath is provided with publishable', async () => {
    try {
      await libraryGenerator(tree, {
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
