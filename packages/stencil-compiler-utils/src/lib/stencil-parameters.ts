import { JsonObject } from '@angular-devkit/core';

export function parseRunParameters(
  runOptions: string[],
  options: JsonObject
) {
  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
