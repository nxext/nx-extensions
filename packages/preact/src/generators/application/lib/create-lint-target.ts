import { NormalizedSchema } from '../schema';
import { joinPathFragments, TargetConfiguration } from '@nx/devkit';

export function createLintTarget(
  options: NormalizedSchema
): TargetConfiguration {
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
