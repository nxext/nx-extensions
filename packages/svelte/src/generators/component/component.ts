import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { createComponentInProject } from './lib/create-component-in-project';
import { convertNxGenerator, Tree } from '@nrwl/devkit';

export interface SvelteComponentSchema {
  name: string;
  project: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
}

export async function componentGenerator(
  tree: Tree,
  options: SvelteComponentSchema
) {
  createComponentInProject(tree, options);
  addExportsToBarrel(tree, options);
}

export default componentGenerator;
export const componentSchematic = convertNxGenerator(componentGenerator);
