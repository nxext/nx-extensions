import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createLibInProject } from './lib/create-library-in-project';
import { Tree } from '@nx/devkit';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
export interface SvelteLibrarySchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'vitest' | 'none';
}

export async function libraryGenerator(
  tree: Tree,
  options: SvelteLibrarySchema
) {
  assertNotUsingTsSolutionSetup(tree, '@nxext/sveltekit', 'library');

  createLibInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default libraryGenerator;
