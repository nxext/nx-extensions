import { join, normalize } from '@angular-devkit/core';
import {
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { SvelteComponentSchema } from '../component';

export function createComponentInProject(
  tree: Tree,
  options: SvelteComponentSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectDirectory = options.directory
    ? join(normalize(options.directory))
    : join(normalize(''));

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/src'),
    joinPathFragments(`${projectConfig.sourceRoot}/${projectDirectory}`),
    names(options.name)
  );
}
