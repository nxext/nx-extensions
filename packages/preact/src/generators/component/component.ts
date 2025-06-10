import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createComponentInProject } from './lib/create-component-in-project';
import { Tree } from '@nx/devkit';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface PreactComponentSchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}

export async function componentGenerator(
  tree: Tree,
  options: PreactComponentSchema
) {
  assertNotUsingTsSolutionSetup(tree, '@nxext/preact', 'component');

  createComponentInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default componentGenerator;
