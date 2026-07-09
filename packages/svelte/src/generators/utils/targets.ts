import { TargetConfiguration } from '@nx/devkit';
import { createEslintLintTarget } from '@nxext/common';
import { NormalizedSchema as ApplicationSchema } from '../application/schema';
import { NormalizedSchema as LibrarySchema } from '../library/schema';

export function createLintAndCheckTargets(
  options: LibrarySchema | ApplicationSchema,
): {
  [key: string]: TargetConfiguration;
} {
  return {
    // NB: hardcodes 'tsconfig.app.json' for both application AND library
    // projects, exactly like the local createLintTarget it replaces did -
    // not "fixed" to 'tsconfig.lib.json' for libraries.
    lint: createEslintLintTarget(options.projectRoot, 'tsconfig.app.json'),
    check: createSvelteCheckTarget(options),
  };
}

export function createSvelteCheckTarget(
  options: LibrarySchema | ApplicationSchema,
): TargetConfiguration {
  return {
    executor: 'nx:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}
