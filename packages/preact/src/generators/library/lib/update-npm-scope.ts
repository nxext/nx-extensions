import { Tree, updateJson } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function updateNpmScopeIfBuildableOrPublishable(
  host: Tree,
  options: NormalizedSchema
) {
  if (options.buildable || options.publishable) {
    updateLibPackageNpmScope(host, options);
  }
}

function updateLibPackageNpmScope(host: Tree, options: NormalizedSchema) {
  return updateJson(host, `${options.projectRoot}/package.json`, (json) => {
    json.name = options.importPath;
    return json;
  });
}
