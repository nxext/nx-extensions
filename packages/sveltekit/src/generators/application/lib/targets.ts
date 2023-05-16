import { TargetConfiguration } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function createSvelteCheckTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: 'nx:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}
