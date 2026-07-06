import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { getProjectSourceRoot } from '@nx/js/internal';
import { SvelteLibrarySchema } from '../library';

export function createLibInProject(tree: Tree, options: SvelteLibrarySchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  // package.json-backed (TS-solution) projects don't carry an explicit
  // `sourceRoot` - getProjectSourceRoot falls back to `<root>/src` for them.
  const sourceRoot = getProjectSourceRoot(projectConfig, tree);
  const projectDirectory = options.directory ?? '';

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${sourceRoot}/${projectDirectory}`),
    names(options.name)
  );
}
