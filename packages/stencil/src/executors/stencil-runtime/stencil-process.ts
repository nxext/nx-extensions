import { CompilerSystem, runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import type { Config } from '@stencil/core/compiler';

type CoreCompiler = typeof import('@stencil/core/compiler');

export const loadCoreCompiler = async (
  sys: CompilerSystem
): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function createStencilProcess(
  config: Config,
  pathCollection: PathCollection
) {
  const coreCompiler = await loadCoreCompiler(config.sys);
  await runTask(coreCompiler, config, config.flags.task);

  if (config.flags.e2e) {
    cleanupE2eTesting(pathCollection);
  }
}

export const isString = (v: any): v is string => typeof v === 'string';

export async function createStencilWatchProcess(config: Config) {
  config.suppressLogs = true;

  config.flags.serve = true;
  config.devServer.openBrowser = config.flags.open;
  config.devServer.reloadStrategy = null;
  config.devServer.initialLoadUrl = '/';
  config.devServer.websocket = false;
  config.maxConcurrentWorkers = 1;
  config.devServer.root = isString(config.flags.root)
    ? config.flags.root
    : config.sys.getCurrentDirectory();

  const devServerPath = config.sys.getDevServerExecutingPath();
  const { start }: typeof import('@stencil/core/dev-server') =
    await config.sys.dynamicImport(devServerPath);
  const devServer = await start(config.devServer, config.logger);

  console.log(`${config.logger.cyan('     Root:')} ${devServer.root}`);
  console.log(`${config.logger.cyan('  Address:')} ${devServer.address}`);
  console.log(`${config.logger.cyan('     Port:')} ${devServer.port}`);
  console.log(`${config.logger.cyan('   Server:')} ${devServer.browserUrl}`);
  console.log(``);

  config.sys.onProcessInterrupt(() => {
    if (devServer) {
      config.logger.debug(`dev server close: ${devServer.browserUrl}`);
      devServer.close();
    }
  });

  return {
    success: true,
    baseUrl: config.devServer.browserUrl,
  };
}
