import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function createFiles(host: Tree, options: NormalizedSchema) {
  const substitutions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  // Files identical in both modes (Design 3.2): framework source, the
  // runtime tsconfigs. tsconfig.lib.json/tsconfig.spec.json already extend
  // `./tsconfig.json` in both modes and don't need to know which mode is
  // active - `wireTsSolutionProject` (called from library.ts) patches
  // their `extends`/compilerOptions programmatically once they're on disk.
  generateFiles(
    host,
    joinPathFragments(__dirname, '..', './files/common'),
    options.projectRoot,
    substitutions,
  );

  // `package.json` is the only file that genuinely differs by mode: in
  // TS-solution mode it's already been written by `addProjectPackageJson`
  // (called from `addProject`, before this function runs) as the
  // authoritative source (name = importPath, main/exports for non-
  // buildable libs) - copying a static template on top here would
  // silently clobber that. The legacy delete-if-not-buildable/publishable
  // behavior is therefore legacy/project.json-only too: TS-solution
  // package.json is mandatory regardless of buildable/publishable (every
  // project needs a resolvable package for the workspace-symlink cross-
  // project resolution).
  if (!options.isUsingTsSolutionConfig) {
    generateFiles(
      host,
      joinPathFragments(__dirname, '..', './files/non-ts-solution'),
      options.projectRoot,
      substitutions,
    );

    if (!options.publishable && !options.buildable) {
      host.delete(`${options.projectRoot}/package.json`);
    }
  } else {
    generateFiles(
      host,
      joinPathFragments(__dirname, '..', './files/ts-solution'),
      options.projectRoot,
      substitutions,
    );
  }
}
