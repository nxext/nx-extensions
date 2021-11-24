import { NormalizedSchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { createViteTargets } from './project/vite';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets = createViteTargets(options);

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Application,
    tags: options.parsedTags,
    targets,
  });
}
