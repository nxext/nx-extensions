import { LibrarySchema } from '../schema';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';

export function updateTsConfig(options: LibrarySchema): Rule {
  return () => {
    return chain([
      (host: Tree, context: SchematicContext) => {
        return updateJsonInTree('tsconfig.base.json', (json) => {
          const c = json.compilerOptions;
          delete c.paths[`@${options.importPath}`];
          c.paths[`@${options.importPath}`] = [
            `${libsDir(host)}/${options.projectDirectory}/src/index.ts`,
          ];
          if (options.buildable) {
            delete c.paths[
              `@${options.importPath}/loader`
            ];
            c.paths[
              `@${options.importPath}/loader`
            ] = [`dist/${libsDir(host)}/${options.projectDirectory}/loader`];
          }
          return json;
        })(host, context);
      },
    ]);
  };
}
