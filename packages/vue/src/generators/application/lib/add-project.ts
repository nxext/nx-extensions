import { addProjectConfiguration, ProjectConfiguration } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}/src`,
    projectType: 'application',
    targets: {},
    tags: options.parsedTags,
  };

  addProjectConfiguration(host, options.appProjectName, {
    ...project,
  });
}
