import { DevExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import {
  InlineConfig,
  UserConfig,
  UserConfigExport,
  ProxyOptions,
  createServer,
  mergeConfig,
  ViteDevServer,
  searchForWorkspaceRoot,
} from 'vite';
import { join, relative } from 'path';
import { defineBaseConfig } from '../../../plugins/vite';
import { replaceFiles } from '../../../plugins/file-replacement';
import { existsSync } from 'fs';
import { Observable } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

async function ensureUserConfig(
  config: UserConfigExport,
  mode: string
): Promise<UserConfig> {
  if (typeof config === 'function') {
    return config({ command: 'build', mode });
  }
  return config;
}

export default async function* runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const baseConfig = defineBaseConfig(context.root);
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
        outDir: relative(projectRoot, options.outputPath),
        emptyOutDir: true,
        reportCompressedSize: true,
        cssCodeSplit: true,
        rollupOptions: {
          plugins: [replaceFiles(options.fileReplacements)],
        },
      },
      server: {
        proxy: proxyConfig,
        fs: {
          allow: [
            searchForWorkspaceRoot(joinPathFragments(projectRoot)),
            joinPathFragments(context.root, 'node_modules/vite'),
          ],
        },
      },
    } as InlineConfig
  );

  const server = await createServer(serverConfig);
  return yield* eachValueFrom(runViteDevServer(server));
}

export function runViteDevServer(
  server: ViteDevServer
): Observable<{ success: boolean; baseUrl: string }> {
  return new Observable((subscriber) => {
    let devServer: ViteDevServer;

    try {
      server
        .listen()
        .then((dev) => {
          devServer = dev;
          const protocol = devServer.config.server.https ? 'https' : 'http';
          const hostname = resolveHostname(devServer.config.server.host);
          const serverBase =
            hostname.host === '127.0.0.1' ? hostname.name : hostname.host;
          const baseUrl = `${protocol}://${serverBase}:${devServer.config.server.port}`;
          server.printUrls();

          subscriber.next({ success: true, baseUrl });
        })
        .catch((err) => {
          subscriber.error(err);
        });

      return async () => await devServer.close();
    } catch (err) {
      subscriber.error(err);
      throw new Error('Could not start dev server');
    }
  });
}

export function resolveHostname(optionsHost: string | boolean | undefined) {
  let host: string | undefined;
  if (
    optionsHost === undefined ||
    optionsHost === false ||
    optionsHost === 'localhost'
  ) {
    // Use a secure default
    host = '127.0.0.1';
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments
    host = undefined; // undefined typically means 0.0.0.0 or :: (listen on all IPs)
  } else {
    host = optionsHost;
  }

  // Set host name to localhost when possible, unless the user explicitly asked for '127.0.0.1'
  const name =
    (optionsHost !== '127.0.0.1' && host === '127.0.0.1') ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === undefined
      ? 'localhost'
      : host;

  return { host, name };
}
