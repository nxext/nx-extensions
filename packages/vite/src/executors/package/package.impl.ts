import { Schema } from './schema';
import {
  build,
  InlineConfig,
  mergeConfig,
  UserConfig,
  UserConfigExport,
} from 'vite';
import { ExecutorContext, joinPathFragments, names } from '@nrwl/devkit';
import baseConfig from '../../../plugins/vite-package';
import { copyFile } from 'fs/promises';
import { relative } from 'path';
import { copyAssets } from '@nrwl/workspace/src/utilities/assets';

async function ensureUserConfig(
  config: UserConfigExport,
  mode: string
): Promise<UserConfig> {
  if (typeof config === 'function') {
    return await Promise.resolve(config({ command: 'build', mode }));
  }
  return await Promise.resolve(config);
}

export default async function runExecutor(
  options: Schema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const viteBaseConfig = await ensureUserConfig(
    baseConfig({
      entry: options.entryFile,
      external: options.external ?? [],
      globals: options.globals ?? {},
      name: names(context.projectName).fileName,
    }),
    context.configurationName
  );

  let frameworkConfig: UserConfigExport;
  if (options.frameworkConfigFile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    frameworkConfig = require(options.frameworkConfigFile)?.default;
  }

  const buildConfig: InlineConfig = mergeConfig(
    mergeConfig(viteBaseConfig, frameworkConfig ?? {}, true),
    {
      root: projectRoot,
      build: {
        outDir: relative(
          projectRoot,
          joinPathFragments(`${context.root}/dist/${projectDir}`)
        ),
        emptyOutDir: true,
        reportCompressedSize: true,
        cssCodeSplit: true,
      },
      configFile:
        options.configFile === '@nxext/vite/plugins/vite-package'
          ? false
          : options.configFile
          ? joinPathFragments(`${context.root}/${options.configFile}`)
          : false,
    }
  );

  await build(buildConfig);

  await copyFile(
    joinPathFragments(options.packageJson ?? `${projectRoot}/package.json`),
    joinPathFragments(
      `${context.root}/dist/${projectDir}/${
        options.packageJson ?? 'package.json'
      }`
    )
  );

  if (options.assets) {
    copyAssets(
      options.assets,
      context.root,
      joinPathFragments(context.root, 'dist', projectDir)
    );
  }

  return {
    success: true,
  };
}
