import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { isUsingTsSolutionSetup } from '@nx/js/internal';
import { createTsSolutionTree } from './testing';

describe('createTsSolutionTree', () => {
  it('produces a tree that isUsingTsSolutionSetup recognizes as TS-solution (Risiko 1)', () => {
    const tree = createTsSolutionTree();

    expect(isUsingTsSolutionSetup(tree)).toBe(true);
  });

  it('does NOT make a plain createTreeWithEmptyWorkspace tree look like TS-solution', () => {
    const legacyTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    expect(isUsingTsSolutionSetup(legacyTree)).toBe(false);
  });

  it('writes the minimal file set isWorkspaceSetupWithTsSolution requires', () => {
    const tree = createTsSolutionTree();

    expect(tree.exists('pnpm-workspace.yaml')).toBe(true);
    expect(tree.exists('tsconfig.json')).toBe(true);
    expect(tree.exists('tsconfig.base.json')).toBe(true);
  });
});
