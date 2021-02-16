import { basename, dirname, getSystemPath, join, normalize, Path, resolve } from '@angular-devkit/core';
import { statSync } from 'fs-extra';

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

