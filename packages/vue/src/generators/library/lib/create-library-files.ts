import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';
import { getRelativePathToRootTsConfig } from '@nx/workspace/src/utilities/typescript';
import { createTsConfig } from '../../utils/create-ts-config';

export function createLibraryFiles(host: Tree, options: NormalizedSchema) {
  const relativePathToRootTsConfig = getRelativePathToRootTsConfig(
    host,
    options.projectRoot
  );
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    join(__dirname, '../files'),
    options.projectRoot,
    templateOptions
  );

  createTsConfig(
    host,
    options.projectRoot,
    'lib',
    options,
    relativePathToRootTsConfig
  );
}
