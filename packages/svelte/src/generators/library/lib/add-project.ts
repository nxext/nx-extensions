import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createLintAndCheckTargets } from '../../utils/targets';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets = createLintAndCheckTargets(options);

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    tags: options.parsedTags,
    targets,
  });
}
