import { StencilBuildOptions } from '../build/schema';
import { StencilTestOptions } from '../test/schema';
import { StencilE2EOptions } from '../e2e/schema';

export function parseRunParameters(
  runOptions: string[],
  options: StencilBuildOptions | StencilTestOptions | StencilE2EOptions
) {
  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
