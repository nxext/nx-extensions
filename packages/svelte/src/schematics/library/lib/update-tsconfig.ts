import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NxJson, readJsonInTree, updateJsonInTree } from '@nrwl/workspace';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { SvelteLibrarySchema } from '../schema';
import { names } from '@nrwl/devkit';

export function updateTsConfig(options: SvelteLibrarySchema): Rule {
  return () => {
    const { fileName } = names(options.name);
    return chain([
      (host: Tree, context: SchematicContext) => {
        const nxJson = readJsonInTree<NxJson>(host, 'nx.json');
        return updateJsonInTree('tsconfig.base.json', (json) => {
          const c = json.compilerOptions;
          delete c.paths[`@${nxJson.npmScope}/${fileName}`];
          c.paths[`@${nxJson.npmScope}/${fileName}`] = [
            `${libsDir(host)}/${fileName}/src/index.ts`,
          ];
          return json;
        })(host, context);
      },
    ]);
  };
}
