import { NormalizedSchema } from '../schema';
import {
  getWorkspaceLayout,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nx/devkit';

export function updateTsConfig(tree: Tree, options: NormalizedSchema) {
  const { libsDir } = getWorkspaceLayout(tree);

  return updateJson(tree, 'tsconfig.base.json', (json) => {
    const c = json.compilerOptions;
    c.paths = c.paths || {};
    delete c.paths[options.importPath];

    if (c.paths[options.importPath]) {
      throw new Error(
        `You already have a library using the import path "${options.importPath}". Make sure to specify a unique one.`
      );
    }

    c.paths[options.importPath] = [
      joinPathFragments(`${libsDir}/${options.projectDirectory}/src/index.ts`),
    ];
    return json;
  });
}
