import { Tree } from 'nx/src/generators/tree';
import { updateJson } from 'nx/src/generators/utils/json';
import { getRootTsConfigPathInTree } from '@nrwl/workspace/src/utilities/typescript';
import { getWorkspaceLayout, joinPathFragments } from '@nrwl/devkit';

import { NormalizedSchema } from '../schema';

export function updateBaseTsConfig(host: Tree, options: NormalizedSchema) {
  updateJson(host, getRootTsConfigPathInTree(host), (json) => {
    const c = json.compilerOptions;
    c.paths = c.paths || {};
    delete c.paths[options.name];

    if (c.paths[options.importPath]) {
      throw new Error(
        `You already have a library using the import path "${options.importPath}". Make sure to specify a unique one.`
      );
    }

    const { libsDir: defaultLibsDir } = getWorkspaceLayout(host);

    c.paths[options.importPath] = [
      joinPathFragments(
        defaultLibsDir,
        `${options.projectDirectory}/src/index.ts`
      ),
    ];

    return json;
  });
}
