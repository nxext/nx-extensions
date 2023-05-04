import { StencilBaseConfigOptions } from './stencil-config';

export function parseRunParameters<T extends StencilBaseConfigOptions>(
  runOptions: string[],
  options: T
) {
  Object.keys(options).forEach((optionKey: string) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    } else if (options[optionKey]) {
      runOptions.push(`--${optionKey}=${options[optionKey]}`);
    }
  });

  return runOptions;
}
