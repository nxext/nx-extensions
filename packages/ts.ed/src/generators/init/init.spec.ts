import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('init schematic', () => {
  let tree: Tree;
  const options: Schema = {
    skipFormat: true,
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

  it('should add Ts.ED dependencies', async () => {
      await initGenerator(tree, options);
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
});
