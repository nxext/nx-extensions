import {
  NormalizedSvelteBuildOptions,
  SvelteBuildOptions,
} from '../build/schema';
import { normalize, resolve, join, relative } from '@angular-devkit/core';
import { InitOptions } from './init';
import { statSync } from 'fs-extra';
import { BuilderContext } from '@angular-devkit/architect';

export function normalizeOptions(
  options: SvelteBuildOptions,
  projectConfig: InitOptions
): NormalizedSvelteBuildOptions {
  return {
    ...options,
    ...projectConfig,
    sourceRoot: normalize(`${projectConfig.projectRoot}/src`),
  } as NormalizedSvelteBuildOptions;
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
  outputPath: string,
  contex: BuilderContext
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
