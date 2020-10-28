import { SvelteBuildOptions, RawSvelteBuildOptions } from '../build/schema';
import { normalize, getSystemPath } from '@angular-devkit/core';
import { resolve, dirname, relative, basename, join } from 'path';
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

  const sourceRoot = join(projectConfig.projectRoot, 'src');

  return {
    ...options,
    ...projectConfig,
    rollupConfig,
    sveltePreprocessConfig,
    assets: normalizeAssets(options.assets, projectConfig.projectRoot, sourceRoot),
    sourceRoot,
  } as SvelteBuildOptions;
}
export interface NormalizedCopyAssetOption {
  glob: string;
  input: string;
  output: string;
}

export function normalizeAssets(
  assets: any[],
  root: string,
  sourceRoot: string
): NormalizedCopyAssetOption[] {
  return assets.map((asset) => {
    if (typeof asset === 'string') {
      const assetPath = normalize(asset);
      const resolvedAssetPath = resolve(root, assetPath);
      const resolvedSourceRoot = resolve(root, sourceRoot);
      const resolvedRoot = resolve(root);

      if (!resolvedAssetPath.startsWith(resolvedRoot)) {
        throw new Error(
          `The ${resolvedAssetPath} asset path must start with the project source root: ${resolvedRoot}`
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
        input: getSystemPath(normalize(resolvedAssetPath)),
        // Now we remove starting slash to make Webpack place it from the output root.
        output: asset.output.replace(/^\//, ''),
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
    ? assets.map((a) => ({
      src: join(a.input, a.glob).replace(/\\/g, '/'),
      dest: join(outputPath, a.output).replace(/\\/g, '/'),
    }))
    : undefined;
}
