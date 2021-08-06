import { ApplicationSchema } from '../schema';
import { addProjectConfiguration, NxJsonProjectConfiguration, Tree } from '@nrwl/devkit';
import { getDefaultTargets } from '../../../utils/targets';
import { ProjectType } from '@nrwl/workspace';
import { addStylePluginToConfig } from '../../../stencil-core-utils';
import { join } from 'path';

export function addProject(host: Tree, options: ApplicationSchema) {
  const targets = getDefaultTargets(ProjectType.Application, options);
  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags
  };

  addProjectConfiguration(host, options.name, {
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

  addStylePluginToConfig(
    host,
    join(options.projectRoot, 'stencil.config.ts'),
    options.style
  );
}
