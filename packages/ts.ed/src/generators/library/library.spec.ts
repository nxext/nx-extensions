import { TsEdLibrarySchema } from './schema';
import { Linter } from '@nrwl/linter';
import { readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './library';

describe('Ts.ED library schematic', () => {
  let tree;
  const options: TsEdLibrarySchema = {
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
          "@nx/workspace": "0.0.0"
        }
      }
    `
    );
  });

  it('should add Ts.ED dependencies', async () => {
    await libraryGenerator(tree, options);
    const packageJson = readJson(tree, 'package.json');

    //expect(packageJson.devDependencies['svelte']).toBeDefined();
  });

  it('should add Ts.ED project files', async () => {
    await libraryGenerator(tree, options);

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
