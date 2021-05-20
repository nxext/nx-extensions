import { MakeLibBuildableSchema, NormalizedMakeLibBuildableSchema } from '../schema';
import { Tree, updateJson } from '@nrwl/devkit';

export function updateTsConfig(host: Tree, options: NormalizedMakeLibBuildableSchema) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    json.compilerOptions = json.compilerOptions || {};

    delete json.compilerOptions.paths[`${options.importPath}/loader`];
    json.compilerOptions.paths[`${options.importPath}/loader`] = [`dist/${options.projectRoot}/loader`];

    return json;
  });
}
