import { SvelteBuildOptions, RawSvelteBuildOptions } from '../build/schema';
import { normalize, join, resolve, Path, dirname, basename, getSystemPath } from '@angular-devkit/core';
import { InitOptions } from './init';
import { statSync } from 'fs-extra';

export function normalizeOptions(
  options: RawSvelteBuildOptions,
  projectConfig: InitOptions
): SvelteBuildOptions {
  const rollupConfig = options.rollupConfig
    ? getSystemPath(join(normalize(projectConfig.workspaceRoot), options.rollupConfig))
    : null;
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? getSystemPath(join(
        normalize(projectConfig.workspaceRoot),
        options.sveltePreprocessConfig
      ))
    : null;

  const projectRoot = normalize(projectConfig.projectRoot);
  const sourceRoot = join(projectRoot, 'src');
  const destRoot = join(normalize(projectConfig.workspaceRoot), options.outputPath);

  return {
    ...options,
    ...projectConfig,
    rollupConfig,
    sveltePreprocessConfig,
    sourceRoot,
    assets: normalizeAssets(
      options.assets,
      projectRoot,
      sourceRoot,
      destRoot
    ),
  } as SvelteBuildOptions;
}

export interface NormalizedCopyAssetOption {
  input: Path;
  output: Path;
}

export function normalizeAssets(
  assets: (string | NormalizedCopyAssetOption)[],
  projectRoot: Path,
  sourceRoot: Path,
  destRoot: Path
): NormalizedCopyAssetOption[] {
  return assets.map((asset) => {
    if (typeof asset === 'string') {
      const assetPath = normalize(asset);
      const resolvedAssetPath = resolve(projectRoot, assetPath);
      const resolvedSourceRoot = resolve(projectRoot, sourceRoot);

      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(
          `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
        );
      }

      const isDirectory = statSync(getSystemPath(resolvedAssetPath)).isDirectory();
      const input = isDirectory ? join(resolvedAssetPath, '**/*') : join(dirname(resolvedAssetPath), basename(resolvedAssetPath));
      const output = join(destRoot, input);

      return {
        input,
        output
      };
    } else {
      if (asset.output.startsWith('..')) {
        throw new Error(
          'An asset cannot be written to a location outside of the output path.'
        );
      }

      return {
        ...asset,
        input: resolve(projectRoot, normalize(asset.input)),
        // Now we remove starting slash to make Webpack place it from the output root.
        output: destRoot,
      };
    }
  });
}

interface RollupCopyAssetOption {
  src: string;
  dest: string;
}

export function convertCopyAssetsToRollupOptions(
  assets: NormalizedCopyAssetOption[]
): RollupCopyAssetOption[] {
  return assets
    ? assets.map((a) => ({
      src: getSystemPath(a.input),
      dest: getSystemPath(a.output),
    }))
    : undefined;
}
