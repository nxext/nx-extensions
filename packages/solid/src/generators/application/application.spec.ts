import { Schema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

describe('Solid app schematic', () => {
  let tree: Tree;
  const options: Schema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(tree, {}, { '@nrwl/workspace': '15.4.1' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(tree, { ...options });
      expect(tree.exists(`apps/${options.name}/public/index.html`)).toBeFalsy();
      expect(tree.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
