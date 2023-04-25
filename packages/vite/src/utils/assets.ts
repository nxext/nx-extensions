import {
  AssetGlob,
  assetGlobsToFiles,
  FileInputOutput,
} from '@nx/workspace/src/utilities/assets';
import { logger } from '@nx/devkit';
import { copy } from 'fs-extra';

export function copyAssets(
  assets: Array<AssetGlob | string>,
  rootDir: string,
  outDir: string
): Promise<{ success: boolean; error?: string }> {
  const files = assetGlobsToFiles(assets, rootDir, outDir);
  return copyAssetFiles(files);
}

export async function copyAssetFiles(
  files: FileInputOutput[]
): Promise<{ success: boolean; error?: string }> {
  logger.info('Copying asset files...');
  try {
    await Promise.all(files.map((file) => copy(file.input, file.output)));
    logger.info('Done copying asset files.');
    return { success: true };
  } catch (err) {
    return { error: err.message, success: false };
  }
}
