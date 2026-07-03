import { MakeLibBuildableSchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { getProjectTsImportPath } from '../../storybook-configuration/generator';

export function updateTsConfig(host: Tree, options: MakeLibBuildableSchema) {
  updateJson(host, getRootTsConfigPathInTree(host), (json) => {
    const c = json.compilerOptions;
    const tsBasePathKey =
      options.importPath || getProjectTsImportPath(host, options.name);

    delete c.paths[`${tsBasePathKey}`];
    c.paths[`${tsBasePathKey}`] = [`dist/libs/${options.name}`];

    // Project-Crystal-inferred builds run Stencil's CLI directly with no Nx
    // rootDir override, so the `esmLoaderPath: '../loader'` on the `dist`
    // output target (see make-lib-buildable.ts) resolves relative to the
    // project's own root, not the `dist/libs/<lib>` Nx-convention output dir.
    // Point at the concrete entry file, not the bare directory: the loader
    // output has no package.json, so Vite/Rollup's ESM resolution (unlike
    // Node's CJS require()) won't imply `/index.js` for a directory import.
    delete c.paths[`${tsBasePathKey}/loader`];
    c.paths[`${tsBasePathKey}/loader`] = [
      `${options.projectRoot}/loader/index.js`,
    ];

    delete c.paths[`${tsBasePathKey}/*`];
    c.paths[`${tsBasePathKey}/*`] = [
      `dist/libs/${options.name}/dist/components/*`,
    ];

    return json;
  });
}
