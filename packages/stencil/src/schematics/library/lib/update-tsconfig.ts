import { LibrarySchema } from '../schema';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';

export function updateTsConfig(options: LibrarySchema): Rule {
  return () => {
    return chain([
      (host: Tree, context: SchematicContext) => {
        return updateJsonInTree('tsconfig.base.json', (json) => {
          const c = json.compilerOptions;
          delete c.paths[`${options.importPath}`];
          c.paths[`${options.importPath}`] = [
            `dist/${options.projectRoot}`,
          ];
          return json;
        })(host, context);
      },
    ]);
  };
}
