import { readNxJson } from '@nrwl/workspace';
import { SvelteLibrarySchema } from '../schema';
import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
  updateJson,
} from '@nrwl/devkit';

export function updateTsConfig(tree: Tree, options: SvelteLibrarySchema) {
  const { fileName } = names(options.name);
  const { libsDir } = getWorkspaceLayout(tree);
  const { npmScope } = readNxJson();

  return updateJson(tree, 'tsconfig.base.json', (json) => {
    const c = json.compilerOptions;
    delete c.paths[`@${npmScope}/${fileName}`];
    c.paths[`@${npmScope}/${fileName}`] = [
      joinPathFragments(`${libsDir}/${fileName}/src/index.ts`),
    ];
    return json;
  });
}
