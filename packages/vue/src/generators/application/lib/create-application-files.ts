import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';
import { createTsConfig } from '../../utils/create-ts-config';
import { getRelativePathToRootTsConfig } from '@nx/js';

export function createApplicationFiles(host: Tree, options: NormalizedSchema) {
  const relativePathToRootTsConfig = getRelativePathToRootTsConfig(
    host,
    options.appProjectRoot
  );
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
  };
  generateFiles(
    host,
    join(__dirname, '../files/base'),
    options.appProjectRoot,
    templateOptions
  );

  if (options.routing) {
    generateFiles(
      host,
      join(__dirname, '../files/routing'),
      options.appProjectRoot,
      templateOptions
    );
  }

  createTsConfig(
    host,
    options.appProjectRoot,
    'app',
    options,
    relativePathToRootTsConfig
  );
}
