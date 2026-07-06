import { NormalizedSchema } from '../schema';
import { joinPathFragments, Tree } from '@nx/devkit';
import { maybeAddTsConfigPath } from '@nxext/common';

/**
 * Registers the import path in the root tsconfig (legacy mode only - see
 * `maybeAddTsConfigPath`/Design 1.6). In TS-solution mode cross-project
 * resolution happens through package-manager workspace symlinks + project
 * references (`wireTsSolutionProject`, see library.ts) instead, so this
 * becomes a no-op there.
 *
 * Previously this manually rewrote `tsconfig.base.json` with a hardcoded
 * literal path (no fallback to `tsconfig.json`), which would also have
 * unconditionally added a `paths` entry in a TS-solution workspace where
 * one should never exist. `maybeAddTsConfigPath` delegates to `@nx/js`'s
 * `addTsConfigPath`, which resolves the root tsconfig via
 * `getRootTsConfigPathInTree` (falls back to `tsconfig.json` if
 * `tsconfig.base.json` doesn't exist) and throws the same
 * already-registered error message.
 */
export function updateTsConfig(tree: Tree, options: NormalizedSchema) {
  maybeAddTsConfigPath(
    tree,
    options.importPath,
    [joinPathFragments(`${options.projectRoot}/src/index.ts`)],
    options.isUsingTsSolutionConfig,
  );
}
