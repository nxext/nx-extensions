import { LibrarySchema } from '../schema';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { NxJson, readJsonInTree, updateJsonInTree } from '@nrwl/workspace';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';

export function updateTsConfig(options: LibrarySchema): Rule {
  return () => {
    return chain([
      (host: Tree, context: SchematicContext) => {
        const nxJson = readJsonInTree<NxJson>(host, 'nx.json');
        return updateJsonInTree('tsconfig.base.json', (json) => {
          const c = json.compilerOptions;
          delete c.paths[`@${nxJson.npmScope}/${options.projectDirectory}`];
          c.paths[`@${nxJson.npmScope}/${options.projectDirectory}`] = [
            `${libsDir(host)}/${options.projectDirectory}/src/index.ts`,
          ];
          if (options.buildable) {
            delete c.paths[
              `@${nxJson.npmScope}/${options.projectDirectory}/loader`
            ];
            c.paths[
              `@${nxJson.npmScope}/${options.projectDirectory}/loader`
            ] = [`dist/${libsDir(host)}/${options.projectDirectory}/loader`];
          }
          return json;
        })(host, context);
      },
    ]);
  };
}
