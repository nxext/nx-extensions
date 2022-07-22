import { BuildExecutorSchema } from './schema';
import {
  build,
  InlineConfig,
  UserConfigExport,
  UserConfig,
  mergeConfig,
} from 'vite';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { relative } from 'path';
import { defineBaseConfig } from '../../../plugins/vite';
import { replaceFiles } from '../../../plugins/file-replacement';

async function ensureUserConfig(
  config: UserConfigExport,
  mode: string
): Promise<UserConfig> {
  if (typeof config === 'function') {
    return config({ command: 'build', mode });
  }
  return config;
}

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const baseConfig = defineBaseConfig(context.root);

  const viteBaseConfig = await ensureUserConfig(
    baseConfig,
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
      base: options.baseHref ?? '/',
      build: {
        outDir: relative(projectRoot, options.outputPath),
        emptyOutDir: true,
        reportCompressedSize: true,
        cssCodeSplit: true,
        sourcemap: options.sourcemaps ?? false,
        rollupOptions: {
          plugins: [replaceFiles(options.fileReplacements)],
        },
      },
      configFile:
        options.configFile === '@nxext/vite/plugins/vite'
          ? false
          : options.configFile
          ? joinPathFragments(`${context.root}/${options.configFile}`)
          : undefined,
    }
  );

  try {
    await build(buildConfig);
    logger.info('Bundle complete.');
  } catch (error) {
    logger.error(`Error during bundle: ${error}`);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}
