import { RawSvelteBuildOptions, SvelteBuildOptions } from '../build/schema';
import { getSystemPath, join, normalize } from '@angular-devkit/core';
import { InitOptions } from './init-rollup-options';
import { normalizeAssets } from './normalize-assets';

export function normalizeOptions(
  options: RawSvelteBuildOptions,
  projectConfig: InitOptions
): SvelteBuildOptions {
  const rollupConfig = options.rollupConfig
    ? getSystemPath(
        join(normalize(projectConfig.workspaceRoot), options.rollupConfig)
      )
    : null;
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? getSystemPath(
        join(
          normalize(projectConfig.workspaceRoot),
          options.sveltePreprocessConfig
        )
      )
    : null;

  const projectRoot = normalize(projectConfig.projectRoot);
  const sourceRoot = join(projectRoot, 'src');
  const destRoot = join(
    normalize(projectConfig.workspaceRoot),
    options.outputPath
  );

  return {
    ...options,
    ...projectConfig,
    rollupConfig,
    sveltePreprocessConfig,
    sourceRoot,
    assets: normalizeAssets(options.assets, projectRoot, sourceRoot, destRoot),
  } as SvelteBuildOptions;
}
