import { MakeLibBuildableSchema } from '../schema';
import { Tree, updateJson } from '@nrwl/devkit';

export function updateTsConfig(host: Tree, options: MakeLibBuildableSchema) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    const c = json.compilerOptions;
    delete c.paths[
      `${options.importPath}/loader`
      ];
    c.paths[
      `${options.importPath}/loader`
      ] = [`dist/${options.projectRoot}/loader`];
    return json;
  });
}
