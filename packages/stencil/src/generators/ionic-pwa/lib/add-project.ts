import { PWASchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import { addProjectConfiguration, NxJsonProjectConfiguration, Tree } from '@nrwl/devkit';
import { getDefaultTargets } from '../../../utils/targets';

export function addProject(tree: Tree, options: PWASchema) {
  const targets = getDefaultTargets(ProjectType.Application, options);

  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Application,
    generators: {
      '@nxext/stencil:component': {
        style: options.style
      }
    },
    ...nxConfig,
    targets
  });
}
