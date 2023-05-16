import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  Tree,
} from '@nx/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    tags: options.parsedTags,
    targets: { lint: createLintTarget(options) },
  });
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nx/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.projectRoot, '**/*')}`,
      ],
    },
  };
}
