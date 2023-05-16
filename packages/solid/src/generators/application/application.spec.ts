import { SolidApplicationSchema } from './schema';
import { Linter } from '@nx/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

describe('Solid app generator', () => {
  let tree: Tree;
  const options: SolidApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(tree, { ...options });
      expect(tree.exists(`apps/${options.name}/public/index.html`)).toBeFalsy();
      expect(tree.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
