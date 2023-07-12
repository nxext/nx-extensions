import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import * as path from 'path';

export function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  try {
    generateFiles(
      host,
      path.join(__dirname, '../files'),
      options.projectRoot,
      templateOptions
    );
  } catch (e) {
    throw new Error(e);
  }
}
