import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { useFlatConfig } from '@nx/eslint/src/utils/flat-config';

export function createFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(
    host,
    joinPathFragments(__dirname, '..', './files'),
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
}
