import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  Tree,
} from '@nx/devkit';

export function addProject(tree: Tree, options: NormalizedSchema) {
  addProjectConfiguration(tree, options.name, {
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}/src`,
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
      tsConfig: joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.appProjectRoot, '**/*')}`,
      ],
    },
  };
}
