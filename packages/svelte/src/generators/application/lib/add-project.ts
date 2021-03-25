import { NormalizedSchema } from '../schema';
import { ProjectType } from '@nrwl/workspace';
import { addProjectConfiguration, NxJsonProjectConfiguration, TargetConfiguration, Tree } from '@nrwl/devkit';
import { createRollupTargets } from './project/rollup';
import { createViteTargets } from './project/vite';

export function addProject(tree: Tree, options: NormalizedSchema) {
  let targets: { [key: string]: TargetConfiguration };
  if (options.bundler === 'rollup') {
    targets = createRollupTargets(options);
  } else {
    targets = createViteTargets(options);
  }

  const nxConfig: NxJsonProjectConfiguration = {
    tags: options.parsedTags,
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: ProjectType.Application,
    ...nxConfig,
    targets,
  });
}
