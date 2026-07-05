import { NormalizedSchema } from '../schema';
import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createEslintLintTarget } from '@nxext/common';

export function addProject(tree: Tree, options: NormalizedSchema) {
  addProjectConfiguration(tree, options.name, {
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}/src`,
    projectType: 'application',
    tags: options.parsedTags,
    targets: {
      lint: createEslintLintTarget(options.appProjectRoot, 'tsconfig.app.json'),
    },
  });
}
