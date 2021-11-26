import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, TargetConfiguration, Tree } from '@nrwl/devkit';
import { createRollupTargets } from './project/rollup';
import { createViteTargets } from './project/vite';

export function addProject(tree: Tree, options: NormalizedSchema) {
  let targets: { [key: string]: TargetConfiguration };
  if (options.bundler === 'rollup') {
    targets = createRollupTargets(options);
  } else {
    targets = createViteTargets(options);
  }

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    tags: options.parsedTags,
    targets,
  });
}
