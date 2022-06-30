import { TsEdApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readJson, Tree } from '@nxext/devkit';

describe('Ts.ED app schematic', () => {
  let tree: Tree;
  const options: TsEdApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write(
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

  describe('Ts.ED dependencies', () => {
    it('should add Ts.ED dependencies', async () => {
      await applicationGenerator(tree, options);
      const packageJson = readJson(tree, 'package.json');

      expect(packageJson.dependencies['@tsed/ajv']).toBeDefined();
      expect(packageJson.dependencies['@tsed/common']).toBeDefined();
      expect(packageJson.dependencies['@tsed/core']).toBeDefined();
      expect(packageJson.dependencies['@tsed/di']).toBeDefined();
      expect(packageJson.dependencies['@tsed/engines']).toBeDefined();
      expect(packageJson.dependencies['@tsed/exceptions']).toBeDefined();
      expect(packageJson.dependencies['@tsed/json-mapper']).toBeDefined();
      expect(packageJson.dependencies['@tsed/platform-express']).toBeDefined();
    });
    it('should add Ts.ED specific files', async () => {
      await applicationGenerator(tree, { ...options });
      // expect(tree.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
