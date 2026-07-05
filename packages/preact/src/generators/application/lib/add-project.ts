import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createEslintLintTarget } from '@nxext/common';

export function addProject(tree: Tree, options: NormalizedSchema) {
  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    tags: options.parsedTags,
    targets: {
      lint: createEslintLintTarget(options.projectRoot, 'tsconfig.app.json'),
    },
  });
}
