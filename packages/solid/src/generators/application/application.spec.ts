import { Schema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import {
  addDependenciesToPackageJson,
  readJson,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

describe('Solid app', () => {
  let tree: Tree;
  const options: Schema = {
    name: 'my-app',
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
      expect(tree.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });

  describe('--root-project', () => {
    xit('should create files at the root', async () => {
      await applicationGenerator(tree, {
        ...options,
        name: 'my-app2',
        rootProject: true,
      });
      expect(tree.read('/src/main.tsx')).toBeDefined();
      expect(tree.read('/e2e/cypress.config.ts')).toBeDefined();

      const rootTsConfig = readJson(tree, '/tsconfig.json');
      expect(rootTsConfig.extends).toBeUndefined();
      expect(rootTsConfig.compilerOptions.sourceMap).toBe(true);

      expect(
        readJson(tree, '/workspace.json').projects['my-app2'].architect['build']
          .options['outputPath']
      ).toEqual('dist/my-app2');
    });
  });

  describe('--unitTestRunner', () => {
    it('jest', async () => {
      await applicationGenerator(tree, {
        ...options,
        unitTestRunner: 'jest',
      });
      expect(tree.read(`aps/${options.name}/jest.config.ts`)).toBeDefined();

      expect(
        readJson(tree, '/workspace.json').projects['my-app'].architect['test']
          .builder
      ).toEqual('@nrwl/jest:jest');
    });
  });
});
