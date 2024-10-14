import { createRouteInProject } from './lib/create-route-in-project';
import { Tree } from '@nx/devkit';
export interface SvelteRouteSchema {
  name: string;
  project: string;
  methods?: string;
  methodList?: string[];
  targetPath?: string;
  directory?: string;
  api?: boolean;
  page?: boolean;
  pageClientLoader?: boolean;
  pageServerLoader?: boolean;
  layout?: boolean;
  layoutClientLoader?: boolean;
  layoutServerLoader?: boolean;
  error?: boolean;
  unitTestRunner: 'vitest' | 'none';
}

export async function routeGenerator(tree: Tree, options: SvelteRouteSchema) {
  createRouteInProject(tree, options);
}

export default routeGenerator;
