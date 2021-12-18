import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import { angularInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await angularInitGenerator(tree, {
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.EsLint,
    });
    expect(tree.exists('jest.config.js')).toEqual(false);
  });
});
