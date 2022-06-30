import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nxext/devkit';
import { createLintTarget, createPackageTarget } from '../../utils/targets';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    lint: createLintTarget(options),
  };

  if (options.buildable || options.publishable) {
    targets.build = createPackageTarget('library', options);
  }

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    tags: options.parsedTags,
    targets,
  });
}
