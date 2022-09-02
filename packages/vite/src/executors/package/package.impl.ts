import { Schema } from './schema';
import {
  build,
  InlineConfig,
  mergeConfig,
  UserConfig,
  UserConfigExport,
} from 'vite';
import {
  ExecutorContext,
  joinPathFragments,
  logger,
  names,
} from '@nrwl/devkit';
import baseConfig from '../../../plugins/vite-package';
import { copyFile } from 'fs/promises';
import { relative } from 'path';
import { copyAssets } from '../../utils/assets';
import { checkDependencies } from '../utils/check-dependencies';
import { updatePackageJson } from '../utils/update-package-json';
import { readJsonFile } from '@nrwl/devkit';

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
  options: Schema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const viteBaseConfig = await ensureUserConfig(
    baseConfig({
      entry: options.entryFile,
      workspaceRoot: context.root,
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
        outDir: relative(projectRoot, options.outputPath),
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
  console.log(context);
  const { target, dependencies } = checkDependencies(context);
  console.log('target');
  console.log(target);
  console.log('dependencies');
  console.log(dependencies);
  const packageJson = readJsonFile(options.packageJson);
  console.log('packageJson');
  console.log(packageJson);

  updatePackageJson(options, context, target, dependencies, packageJson);

  // await copyFile(
  //   joinPathFragments(options.packageJson ?? `${projectRoot}/package.json`),
  //   joinPathFragments(
  //     `${options.outputPath}/${options.packageJson ?? 'package.json'}`
  //   )
  // );

  if (options.assets) {
    await copyAssets(options.assets, context.root, options.outputPath);
  }

  logger.info('Bundle complete.');
  return {
    success: true,
  };
}
