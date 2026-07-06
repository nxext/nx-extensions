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
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
  };

  // Files identical in both modes (Design 3.2): framework source, the
  // runtime tsconfigs (their TS-solution-specific `extends`/compilerOptions
  // divergence is applied programmatically afterwards by
  // `wireTsSolutionProject`, see application.ts).
  generateFiles(
    host,
    joinPathFragments(__dirname, '../files/common'),
    options.appProjectRoot,
    substitutions,
  );

  // `package.json` is the only file that genuinely differs by mode: in
  // TS-solution mode it's already been written by `addProjectPackageJson`
  // (called from `addProject`, before this function runs) as the
  // authoritative source (name = importPath) - copying a static template on
  // top here would silently clobber that.
  if (!options.isUsingTsSolutionConfig) {
    generateFiles(
      host,
      joinPathFragments(__dirname, '../files/non-ts-solution'),
      options.appProjectRoot,
      substitutions,
    );
  }
}
