import {
  ensurePackage,
  generateFiles,
  joinPathFragments,
  names,
  NX_VERSION,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { createTsConfig } from '../../utils/create-ts-config';

export async function createApplicationFiles(
  host: Tree,
  options: NormalizedSchema,
) {
  ensurePackage('@nx/js', NX_VERSION);
  const { getRelativePathToRootTsConfig } = await import('@nx/js');

  const substitutions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  // Files identical in both modes (Design 3.2): framework source, svelte
  // config, the runtime tsconfigs (their TS-solution-specific `extends`/
  // compilerOptions divergence is applied programmatically afterwards by
  // `wireTsSolutionProject`, see application.ts).
  generateFiles(
    host,
    joinPathFragments(__dirname, '../files/common'),
    options.projectRoot,
    substitutions,
  );

  // `package.json` is the only file that genuinely differs by mode: in
  // TS-solution mode it's already been written by `addProjectPackageJson`
  // (called from `addProject`, before this function runs) as the
  // authoritative source (name = importPath, possible `nx.tags`) - copying
  // a static template on top here would silently clobber that.
  if (!options.isUsingTsSolutionConfig) {
    generateFiles(
      host,
      joinPathFragments(__dirname, '../files/non-ts-solution'),
      options.projectRoot,
      substitutions,
    );
  }

  const relativePathToRootTsConfig = getRelativePathToRootTsConfig(
    host,
    options.projectRoot,
  );

  createTsConfig(
    host,
    options.projectRoot,
    'app',
    {
      ...options,
      bundler: 'vite',
    },
    relativePathToRootTsConfig,
  );
}
