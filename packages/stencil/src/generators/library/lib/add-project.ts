import { addProjectConfiguration, NxJsonProjectConfiguration, Tree } from '@nrwl/devkit';
import { getTestTarget } from '../../../utils/targets';
import { ProjectType } from '@nrwl/workspace';
import { NormalizedLibrarySchema } from '../schema';

export function addProject(tree: Tree, options: NormalizedLibrarySchema) {
  const targets: Record<string, any> = {};
  targets.test = getTestTarget(ProjectType.Library, options);
  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Library,
    generators: {
      '@nxext/stencil:component': {
        style: options.style
      }
    },
    ...nxConfig,
    targets
  });
}
