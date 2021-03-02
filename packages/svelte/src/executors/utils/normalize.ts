import { RawSvelteBuildOptions, SvelteBuildOptions } from '../build/schema';
import { normalizeAssets } from './normalize-assets';
import { dirname, resolve } from 'path';

export function normalizeOptions(
  options: RawSvelteBuildOptions,
  root: string,
  sourceRoot: string
): SvelteBuildOptions {
  const sveltePreprocessConfig = normalizePluginPath(options.sveltePreprocessConfig, root);
  const entryFile = `${root}/${options.entryFile}`;
  const entryRoot = dirname(entryFile);
  const project = `${root}/${options.project}`;
  const projectRoot = dirname(project);
  const outputPath = `${root}/${options.outputPath}`;

  return {
    ...options,
    assets: options.assets
      ? normalizeAssets(options.assets, root, sourceRoot)
      : undefined,
    rollupConfig: normalizePluginPath(options.rollupConfig, root),
    entryFile,
    entryRoot,
    project,
    projectRoot,
    outputPath,
    sveltePreprocessConfig
  };
}

function normalizePluginPath(pluginPath: void | string, root: string) {
  if (!pluginPath) {
    return '';
  }
  try {
    return require.resolve(pluginPath);
  } catch {
    return resolve(root, pluginPath);
  }
}
