import { SvelteBuildOptions, RawSvelteBuildOptions } from '../build/schema';
import { normalize, resolve, join, relative } from '@angular-devkit/core';
import { InitOptions } from './init';
import { statSync } from 'fs-extra';

export function normalizeOptions(
  options: RawSvelteBuildOptions,
  projectConfig: InitOptions
): SvelteBuildOptions {
  const rollupConfig = options.rollupConfig
    ? join(normalize(projectConfig.workspaceRoot), options.rollupConfig)
    : null;
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? join(
        normalize(projectConfig.workspaceRoot),
        options.sveltePreprocessConfig
      )
    : null;
  return {
    ...options,
    ...projectConfig,
    rollupConfig,
    sveltePreprocessConfig,
    sourceRoot: normalize(`${projectConfig.projectRoot}/src`),
  } as SvelteBuildOptions;
}

export interface AssetCopyCommand {
  src: string;
  dest: string;
  flatten: boolean;
}

export function normalizeAssetCopyCommands(
  assets: string[],
  workspaceRoot: string,
  projectRoot: string,
  outputPath: string
): AssetCopyCommand[] {
  if (!assets) {
    return [];
  }

  return assets.map((asset) => {
    const normalizedRoot = normalize(workspaceRoot);
    const assetPath = normalize(asset);

    const resolvedAssetPath = resolve(normalizedRoot, assetPath);
    const resolvedProjectRoot = resolve(normalizedRoot, normalize(projectRoot));
    const resolvedOutputPath = resolve(normalizedRoot, normalize(outputPath));

    if (!resolvedAssetPath.startsWith(resolvedProjectRoot)) {
      throw new Error(
        `The ${resolvedAssetPath} asset path must start with the project source root: ${projectRoot}`
      );
    }

    const isDirectory = statSync(resolvedAssetPath).isDirectory();
    const relsrc = relative(normalizedRoot, resolvedAssetPath);
    const src = isDirectory ? join(relsrc, normalize('**/*')) : relsrc;
    const dest = relative(normalizedRoot, resolvedOutputPath);

    return {
      src,
      dest,
      flatten: false,
    };
  });
}
