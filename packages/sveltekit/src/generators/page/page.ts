import { createPageInProject as createPageInProject } from './lib/create-page-in-project';
import { Tree } from '@nx/devkit';
export interface SveltePageSchema {
  name: string;
  project: string;
  targetPath?: string;
  directory?: string;
  layout?: boolean;
  loader?: boolean;
  error?: boolean;
  unitTestRunner: 'vitest' | 'none';
}

export async function pageGenerator(tree: Tree, options: SveltePageSchema) {
  createPageInProject(tree, options);
}

export default pageGenerator;
