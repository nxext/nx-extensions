import { Schema } from './schema';
import { build, UserConfig, UserConfigExport } from 'vite';
import { ExecutorContext, joinPathFragments, names } from '@nrwl/devkit';
import baseConfig from '../../../plugins/vite-package';
import { copyFile } from 'fs/promises';
import { existsSync, statSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, relative } from 'path';

function copyRecursiveSync(src: string, dest: string) {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    mkdirSync(dest);
    readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
}

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

  await build({
    ...viteBaseConfig,
    configFile:
      options.configFile === '@nxext/vite/plugins/vite-package'
        ? false
        : options.configFile
        ? joinPathFragments(`${context.root}/${options.configFile}`)
        : false,
    root: projectRoot,
    build: {
      ...viteBaseConfig.build,
      outDir: relative(
        projectRoot,
        joinPathFragments(`${context.root}/dist/${projectDir}`)
      ),
      emptyOutDir: true,
      reportCompressedSize: true,
      cssCodeSplit: true,
    },
  });

  await copyFile(
    joinPathFragments(
      `${context.root}/${options.packageJson ?? 'package.json'}`
    ),
    options.outputPath
  );

  if (options.assets) {
    copyRecursiveSync(
      `${context.root}/${options.assets}`,
      joinPathFragments(`${context.root}/${options.assets}`)
    );
  }

  return {
    success: true,
  };
}
