import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { SvelteLibrarySchema } from '../library';

export function createLibInProject(tree: Tree, options: SvelteLibrarySchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory ?? '';

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${projectConfig.sourceRoot}/${projectDirectory}`),
    names(options.name)
  );
}
