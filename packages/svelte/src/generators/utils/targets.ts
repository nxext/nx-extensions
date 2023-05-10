import { joinPathFragments, TargetConfiguration } from '@nx/devkit';
import { NormalizedSchema as ApplicationSchema } from '../application/schema';
import { NormalizedSchema as LibrarySchema } from '../library/schema';

export function createLintAndCheckTargets(
  options: LibrarySchema | ApplicationSchema
): {
  [key: string]: TargetConfiguration;
} {
  return {
    lint: createLintTarget(options),
    check: createSvelteCheckTarget(options),
  };
}

export function createSvelteCheckTarget(
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  return {
    executor: 'nx:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}

export function createLintTarget(
  options: LibrarySchema | ApplicationSchema
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
