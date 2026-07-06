import { MakeLibBuildableSchema } from '../schema';
import { Tree, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import { isUsingTsSolutionSetup } from '@nxext/common';
import { getProjectTsImportPath } from '../../storybook-configuration/generator';

export function updateTsConfig(host: Tree, options: MakeLibBuildableSchema) {
  // TS-solution mode never writes a `paths` entry (Design 1.6): cross-project
  // resolution happens via package-manager workspace symlinks + project
  // references instead - see `wireTsSolutionProject`/`maybeAddTsConfigPath`
  // in `@nxext/common`. `getRootTsConfigPathInTree` still resolves to
  // `tsconfig.base.json` in both modes, but only the legacy mode wants this
  // function's writes.
  if (isUsingTsSolutionSetup(host)) {
    return;
  }

  updateJson(host, getRootTsConfigPathInTree(host), (json) => {
    const c = json.compilerOptions;
    const tsBasePathKey =
      options.importPath || getProjectTsImportPath(host, options.name);

    // Project-Crystal-inferred builds run Stencil's CLI directly with no Nx
    // rootDir override, so all output targets (see make-lib-buildable.ts)
    // resolve relative to the project's own root (`options.projectRoot`),
    // not a `dist/libs/<lib>` workspace-level convention - the previous
    // hardcoded `dist/libs/${options.name}` ignored `options.projectRoot`
    // entirely (pre-existing bug, unrelated to TS-solution, fixed here).
    delete c.paths[`${tsBasePathKey}`];
    c.paths[`${tsBasePathKey}`] = [`${options.projectRoot}/dist`];

    // Point at the concrete entry file, not the bare directory: the loader
    // output has no package.json, so Vite/Rollup's ESM resolution (unlike
    // Node's CJS require()) won't imply `/index.js` for a directory import.
    delete c.paths[`${tsBasePathKey}/loader`];
    c.paths[`${tsBasePathKey}/loader`] = [
      `${options.projectRoot}/loader/index.js`,
    ];

    delete c.paths[`${tsBasePathKey}/*`];
    c.paths[`${tsBasePathKey}/*`] = [
      `${options.projectRoot}/dist/components/*`,
    ];

    return json;
  });
}
