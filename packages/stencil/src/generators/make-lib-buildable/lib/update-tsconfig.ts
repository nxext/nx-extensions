import { MakeLibBuildableSchema } from '../schema';
import { Tree, updateJson } from '@nrwl/devkit';
import { getRootTsConfigPathInTree } from '@nrwl/workspace/src/utilities/typescript';
import { getProjectTsImportPath } from '../../storybook-configuration/generator';

export function updateTsConfig(host: Tree, options: MakeLibBuildableSchema) {
  updateJson(host, getRootTsConfigPathInTree(host), (json) => {
    const c = json.compilerOptions;
    const tsBasePathKey =
      options.importPath || getProjectTsImportPath(host, options.name);

    delete c.paths[`${tsBasePathKey}`];
    c.paths[`${tsBasePathKey}`] = [`dist/libs/${options.name}`];

    delete c.paths[`${tsBasePathKey}/loader`];
    c.paths[`${tsBasePathKey}/loader`] = [`dist/libs/${options.name}/loader`];

    delete c.paths[`${tsBasePathKey}/*`];
    c.paths[`${tsBasePathKey}/*`] = [
      `dist/libs/${options.name}/dist/components/*`,
    ];

    return json;
  });
}
