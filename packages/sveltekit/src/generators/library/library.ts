import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createLibInProject } from './lib/create-library-in-project';
import { Tree } from '@nx/devkit';
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
  createLibInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default libraryGenerator;
