import { ProjectType } from '@nrwl/workspace';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import applicationGenerator from '../application/application';
import { Tree } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nxext/svelte';

export async function createTestProject(
  name: string,
  type: ProjectType = ProjectType.Application
): Promise<Tree> {
  const tree = createTreeWithEmptyWorkspace();
  if (type === ProjectType.Application) {
    await applicationGenerator(tree, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: 'none',
      e2eTestRunner: 'none',
    });
  }
  if (type === ProjectType.Library) {
    await libraryGenerator(tree, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: 'none',
      e2eTestRunner: 'none',
    });
  }

  return tree;
}
