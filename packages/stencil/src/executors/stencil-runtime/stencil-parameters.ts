import { StencilBaseConfigOptions } from './stencil-config';

export function parseRunParameters<T extends StencilBaseConfigOptions>(
  runOptions: string[],
  options: T
) {
  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
