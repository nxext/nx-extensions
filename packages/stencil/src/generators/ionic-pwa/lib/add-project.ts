import { PWASchema } from '../schema';
import { addProjectConfiguration, Tree } from '@nx/devkit';
import { getDefaultTargets } from '../../../utils/targets';

export function addProject(tree: Tree, options: PWASchema) {
  const targets = getDefaultTargets('application', options);

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    generators: {
      '@nxext/stencil:component': {
        style: options.style,
      },
    },
    tags: options.parsedTags,
    targets,
  });
}
