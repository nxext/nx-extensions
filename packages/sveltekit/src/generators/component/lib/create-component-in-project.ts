import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { SvelteComponentSchema } from '../component';

export function createComponentInProject(
  tree: Tree,
  options: SvelteComponentSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory ?? '';

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${projectConfig.sourceRoot}/${projectDirectory}`),
    names(options.name)
  );
}
