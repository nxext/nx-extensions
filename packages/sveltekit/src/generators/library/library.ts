import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createLibraryInProject } from './lib/create-library-in-project';
import { Tree } from '@nx/devkit';
export interface SvelteLibrarySchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'vitest' | 'none';
}

export async function LibraryGenerator(
  tree: Tree,
  options: SvelteLibrarySchema
) {
  createLibraryInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default LibraryGenerator;
