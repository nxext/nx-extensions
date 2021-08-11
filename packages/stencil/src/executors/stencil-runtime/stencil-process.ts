import { CompilerSystem, runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { PathCollection } from './types';
import { logger } from '@nrwl/devkit';
import type { Config } from '@stencil/core/compiler';

type CoreCompiler = typeof import('@stencil/core/compiler');

const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function createStencilProcess(config: Config, pathCollection: PathCollection) {
  try {
    const coreCompiler = await loadCoreCompiler(config.sys);
    await runTask(coreCompiler, config, config.flags.task);

    if (config.flags.e2e) {
      cleanupE2eTesting(pathCollection);
    }

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
