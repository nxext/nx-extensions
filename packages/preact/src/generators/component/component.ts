import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createComponentInProject } from './lib/create-component-in-project';
import { Tree } from '@nx/devkit';

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
  createComponentInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default componentGenerator;
