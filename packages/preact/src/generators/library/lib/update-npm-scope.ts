import { Tree } from '@nx/devkit';
import { shouldUpdateNpmScope, updateLibPackageNpmScope } from '@nxext/common';
import { NormalizedSchema } from '../schema';

export function updateNpmScopeIfBuildableOrPublishable(
  host: Tree,
  options: NormalizedSchema
) {
  if (shouldUpdateNpmScope(options)) {
    updateLibPackageNpmScope(host, options);
  }
}
