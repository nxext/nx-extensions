import { DevExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import {
  InlineConfig,
  printHttpServerUrls,
  UserConfig,
  UserConfigExport,
  ProxyOptions,
  createServer,
  mergeConfig,
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

  let frameworkConfig: UserConfigExport;
  if (options.frameworkConfigFile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    frameworkConfig = require(options.frameworkConfigFile)?.default;
  }
  const serverConfig: InlineConfig = mergeConfig(
    mergeConfig(viteBaseConfig, frameworkConfig ?? {}),
    {
      configFile:
        options.configFile === '@nxext/vite/plugins/vite'
          ? false
          : options.configFile
          ? joinPathFragments(`${context.root}/${options.configFile}`)
          : undefined,
      base: options.baseHref ?? '/',
      root: projectRoot,
      build: {
        outDir: relative(
          projectRoot,
          joinPathFragments(`${context.root}/dist/${projectDir}`)
        ),
        emptyOutDir: true,
        reportCompressedSize: true,
        cssCodeSplit: true,
        rollupOptions: {
          plugins: [replaceFiles(options.fileReplacements)],
        },
      },
      server: {
        proxy: proxyConfig,
      },
    } as InlineConfig
  );

  const server = await createServer(serverConfig);
  const devServer = await server.listen();

  if (
    typeof (devServer as unknown as { printUrls: unknown }).printUrls ===
    'function'
  ) {
    (devServer as unknown as { printUrls: () => void }).printUrls();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    printHttpServerUrls(devServer as any, serverConfig as any);
  }
  await new Promise<void>((resolve, reject) => {
    devServer.watcher.on('event', (data: RollupWatcherEvent) => {
      if (data.code === 'END') {
        resolve();
      } else if (data.code === 'ERROR') {
        reject();
      }
    });
  });

  await devServer.close();

  return { success: true };
}
