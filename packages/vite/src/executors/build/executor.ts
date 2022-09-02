import { BuildExecutorSchema } from './schema';
import { readJsonFile } from '@nrwl/devkit';

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
import { checkDependencies } from '../utils/check-dependencies';
import { updatePackageJson } from '../utils/update-package-json';

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

  const { target, dependencies } = checkDependencies(context);
  // const externalPackages = dependencies
  // .map((d) => d.name)
  // .concat(options.external || [])
  // .concat(Object.keys(packageJson.dependencies || {})
  try {
    await build(buildConfig);
    const packageJson = readJsonFile(options.project);

    updatePackageJson(options, context, target, dependencies, packageJson);

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
