import { createRouteInProject } from './lib/create-route-in-project';
import { Tree } from '@nx/devkit';
export interface SvelteRouteSchema {
  name: string;
  project: string;
  methods?: string;
  methodList?: string[];
  targetPath?: string;
  directory?: string;
  server?: boolean;
  page?: boolean;
  layout?: boolean;
  data?: boolean;
  error?: boolean;
  unitTestRunner: 'vitest' | 'none';
}

export async function routeGenerator(tree: Tree, options: SvelteRouteSchema) {
  createRouteInProject(tree, options);
}

export default routeGenerator;
