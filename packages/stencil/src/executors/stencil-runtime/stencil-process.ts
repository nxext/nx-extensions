import { CompilerSystem, runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import type { Config } from '@stencil/core/compiler';
import { DevServer } from '@stencil/core/dev-server';

type CoreCompiler = typeof import('@stencil/core/compiler');

const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function createStencilProcess(config: Config, pathCollection: PathCollection) {

  const coreCompiler = await loadCoreCompiler(config.sys);
  await runTask(coreCompiler, config, config.flags.task);

  if (config.flags.e2e) {
    cleanupE2eTesting(pathCollection);
  }
}

export async function createStencilWatchProcess(config: Config) {
  let devServer: DevServer = null;
  let exitCode = 0;

  try {
    const coreCompiler = await loadCoreCompiler(config.sys);

    const compiler = await coreCompiler.createCompiler(config);
    const watcher = await compiler.createWatcher();

    if (config.flags.serve) {
      const devServerPath = config.sys.getDevServerExecutingPath();
      const { start }: typeof import('@stencil/core/dev-server') = await config.sys.dynamicImport(devServerPath);
      devServer = await start(config.devServer, config.logger, watcher);
    }

    if (devServer) {
      const rmDevServerLog = watcher.on('buildFinish', () => {
        rmDevServerLog();
        // log the dev server url one time
        config.logger.info(`${config.logger.cyan(devServer.browserUrl)}\n`);
      });
    }

    const closeResults = await watcher.start();
    if (closeResults.exitCode > 0) {
      exitCode = closeResults.exitCode;
    }

    const tearDown = () => {
      compiler && compiler.destroy();
      config.sys.exit(0);
    };
    // Teardown and kill the child processes
    process.on('exit', tearDown);
    process.on('SIGTERM', tearDown);
  } catch (error) {
    exitCode = 1;
    config.logger.error(error);
  }

  if (devServer) {
    await devServer.close();
  }

  if (exitCode > 0) {
    await config.sys.exit(exitCode);
  }

  return {
    success: exitCode > 0,
    baseUrl: config.devServer.browserUrl
  }
}
