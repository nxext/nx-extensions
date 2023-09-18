import { Schema } from './schema';
import { Linter } from '@nx/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

describe('Solid app generator', () => {
  let tree: Tree;
  const options: Schema = {
    name: 'myApp',
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    e2eTestRunner: 'cypress',
    projectNameAndRootFormat: 'derived',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(tree, { ...options });
      expect(tree.exists(`apps/my-app/public/index.html`)).toBeFalsy();
      expect(tree.exists(`apps/my-app/index.html`)).toBeTruthy();
    });

    it('should add vite specific files as rootProject', async () => {
      await applicationGenerator(tree, { ...options, rootProject: true });
      expect(tree.exists(`public/index.html`)).toBeFalsy();
      expect(tree.exists(`index.html`)).toBeTruthy();
    });
  });
});
