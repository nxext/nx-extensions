import { SolidApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('Solid app schematic', () => {
  let tree;
  const options: SolidApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
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

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(tree, { ...options });

      expect(tree.exists(`apps/${options.name}/public/index.html`)).toBeFalsy();
      expect(tree.exists(`apps/${options.name}/vite.config.js`)).toBeTruthy();
      expect(tree.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
