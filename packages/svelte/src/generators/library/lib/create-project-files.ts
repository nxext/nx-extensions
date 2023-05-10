import {
  ensurePackage,
  generateFiles,
  joinPathFragments,
  names,
  NX_VERSION,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { createTsConfig } from '../../utils/create-ts-config';

export async function createProjectFiles(
  host: Tree,
  options: NormalizedSchema
) {
  ensurePackage('@nx/js', NX_VERSION);
  const { getRelativePathToRootTsConfig } = await import('@nx/js');

  generateFiles(
    host,
    joinPathFragments(__dirname, '../files'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
    }
  );

  if (!options.publishable && !options.buildable) {
    host.delete(`${options.projectRoot}/package.json`);
  }

  const relativePathToRootTsConfig = getRelativePathToRootTsConfig(
    host,
    options.projectRoot
  );

  createTsConfig(
    host,
    options.projectRoot,
    'lib',
    {
      ...options,
      bundler: 'vite',
    },
    relativePathToRootTsConfig
  );
}
