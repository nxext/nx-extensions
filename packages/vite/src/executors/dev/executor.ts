import { DevExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import {
  preview,
  InlineConfig,
  printHttpServerUrls,
  UserConfig,
  UserConfigExport,
  resolveConfig,
  ProxyOptions,
} from 'vite';
import { join, relative } from 'path';
import { RollupWatcherEvent } from 'rollup';
import baseConfig from '../../../plugins/vite';
import { replaceFiles } from '../../../plugins/file-replacement';
import { existsSync } from 'fs';

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
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const viteBaseConfig = await ensureUserConfig(
    baseConfig,
    context.configurationName
  );

  // look for the proxy.conf.json
  let proxyConfig: Record<string, string | ProxyOptions>;
  const proxyConfigPath = options.proxyConfig
    ? join(context.root, options.proxyConfig)
    : join(projectRoot, 'proxy.conf.json');

  if (existsSync(proxyConfigPath)) {
    logger.info(`found proxy configuration at ${proxyConfigPath}`);
    proxyConfig = require(proxyConfigPath);
  }

  const serverConfig: InlineConfig = {
    ...viteBaseConfig,
    configFile:
      options.configFile === '@nxext/vite/plugin/vite-package'
        ? false
        : options.configFile
        ? joinPathFragments(`${context.root}/${options.configFile}`)
        : undefined,
    base: options.baseHref ?? '/',
    build: {
      ...viteBaseConfig.build,
      outDir: relative(
        projectRoot,
        joinPathFragments(`${context.root}/dist/${projectDir}`)
      ),
      emptyOutDir: true,
      reportCompressedSize: true,
      cssCodeSplit: true,
      rollupOptions: {
        ...(viteBaseConfig.build?.rollupOptions || {}),
        plugins: [
          ...(viteBaseConfig.build?.rollupOptions?.plugins || []),
          replaceFiles(options.fileReplacements),
        ],
      },
    },
    server: {
      proxy: proxyConfig,
    },
  };

  const server = await preview(
    await resolveConfig(serverConfig, 'serve', context.configurationName),
    {}
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  printHttpServerUrls(server, serverConfig as any);

  const devProcess = await server.listen();
  await new Promise<void>((resolve, reject) => {
    devProcess.on('event', (data: RollupWatcherEvent) => {
      if (data.code === 'END') {
        resolve();
      } else if (data.code === 'ERROR') {
        reject();
      }
    });
  });

  await devProcess.close();

  return { success: true };
}
