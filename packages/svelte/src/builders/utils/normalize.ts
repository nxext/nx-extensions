import { SvelteBuildOptions, RawSvelteBuildOptions } from '../build/schema';
import { normalize, join, resolve, Path, dirname, basename, relative, getSystemPath } from '@angular-devkit/core';
import { join as pathJoin } from 'path';
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

  const projectRoot = normalize(projectConfig.projectRoot);
  const sourceRoot = join(projectRoot, 'src');

  return {
    ...options,
    ...projectConfig,
    rollupConfig,
    sveltePreprocessConfig,
    sourceRoot,
    assets: normalizeAssets(
      options.assets,
      projectRoot,
      sourceRoot
    ),
  } as SvelteBuildOptions;
}

export interface NormalizedCopyAssetOption {
  glob: string;
  input: string;
  output: string;
}

export function normalizeAssets(
  assets: (string | NormalizedCopyAssetOption)[],
  root: Path,
  sourceRoot: Path
): NormalizedCopyAssetOption[] {
  return assets.map((asset) => {
    if (typeof asset === 'string') {
      const assetPath = normalize(asset);
      const resolvedAssetPath = resolve(normalize(root), assetPath);
      const resolvedSourceRoot = resolve(normalize(root), sourceRoot);

      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(
          `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
        );
      }

      const isDirectory = statSync(resolvedAssetPath).isDirectory();
      const input = isDirectory
        ? resolvedAssetPath
        : dirname(resolvedAssetPath);
      const output = relative(resolvedSourceRoot, resolve(root, input));
      const glob = isDirectory ? '**/*' : basename(resolvedAssetPath);
      return {
        input,
        output,
        glob,
      };
    } else {
      if (asset.output.startsWith('..')) {
        throw new Error(
          'An asset cannot be written to a location outside of the output path.'
        );
      }

      const assetPath = normalize(asset.input);
      const resolvedAssetPath = resolve(root, assetPath);
      return {
        ...asset,
        input: getSystemPath(resolvedAssetPath),
        // Now we remove starting slash to make Webpack place it from the output root.
        output: getSystemPath(normalize(asset.output.replace(/^\//, ''))),
      };
    }
  });
}

interface RollupCopyAssetOption {
  src: string;
  dest: string;
}

export function convertCopyAssetsToRollupOptions(
  outputPath: string,
  assets: NormalizedCopyAssetOption[]
): RollupCopyAssetOption[] {
  return assets
    ? assets.map((normalizedCopyAssetOption) => ({
        src: getSystemPath(normalize(pathJoin(normalizedCopyAssetOption.input, normalizedCopyAssetOption.glob).replace(/\\/g, '/'))),
        dest: getSystemPath(normalize(pathJoin(outputPath, normalizedCopyAssetOption.output).replace(/\\/g, '/'))),
      }))
    : undefined;
}
