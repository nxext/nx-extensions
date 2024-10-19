import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, TargetConfiguration, Tree } from '@nx/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    tags: options.parsedTags,
  });
}
