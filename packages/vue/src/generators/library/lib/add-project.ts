import { addProjectConfiguration, ProjectConfiguration } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    targets: {},
    tags: options.parsedTags,
  };

  addProjectConfiguration(host, options.projectName, {
    ...project,
  });
}
