import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, ProjectConfiguration, Tree } from '@nrwl/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}/src`,
    projectType: 'application',
    targets: {},
    tags: options.parsedTags,
  };

  addProjectConfiguration(tree, options.name, {
    ...project
  });
}
