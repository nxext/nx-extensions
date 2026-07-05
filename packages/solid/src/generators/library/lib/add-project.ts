import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, TargetConfiguration, Tree } from '@nx/devkit';
import { createEslintLintTarget } from '@nxext/common';

export function addProject(tree: Tree, options: NormalizedSchema) {
  const targets: { [key: string]: TargetConfiguration } = {
    lint: createEslintLintTarget(options.projectRoot, 'tsconfig.lib.json'),
  };

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'library',
    tags: options.parsedTags,
    targets,
  });
}
