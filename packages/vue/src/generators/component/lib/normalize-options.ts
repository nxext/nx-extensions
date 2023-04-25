import { names, readProjectConfiguration, Tree } from '@nx/devkit';
import { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  const project = readProjectConfiguration(tree, options.project);
  const projectRoot = project.root;
  const fileName = names(options.name).className;
  const projectSourceRoot = project.sourceRoot;
  const directory = options.directory
    ? `components/${options.directory}`
    : `components`;

  return {
    ...options,
    projectRoot,
    fileName,
    directory,
    projectSourceRoot,
  };
}
