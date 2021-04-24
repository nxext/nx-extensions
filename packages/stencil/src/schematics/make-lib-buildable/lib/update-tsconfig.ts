import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { MakeLibBuildableSchema } from '../schema';

export function updateTsConfig(options: MakeLibBuildableSchema): Rule {
  return () => {
    return chain([
      (host: Tree, context: SchematicContext) => {
        return updateJsonInTree('tsconfig.base.json', (json) => {
          const c = json.compilerOptions;
          delete c.paths[
            `@${options.importPath}/loader`
            ];
          c.paths[
            `@${options.importPath}/loader`
            ] = [`dist/${options.projectRoot}/loader`];
          return json;
        })(host, context);
      }
    ]);
  };
}
