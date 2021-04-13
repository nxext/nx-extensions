import { runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { ConfigAndCoreCompiler, ConfigAndPathCollection } from './types';
import { logger } from '@nrwl/devkit';

export async function createStencilProcess(configAndCoreCompiler: ConfigAndCoreCompiler, configAndPathCollection: ConfigAndPathCollection) {
  try {
    await runTask(configAndCoreCompiler.coreCompiler, configAndCoreCompiler.config, configAndCoreCompiler.config.flags.task);

    cleanupE2eTesting(configAndPathCollection);

    return { success: true };
  } catch (err) {
    logger.error(err.message);
    return { success: false, error: err.message };
  }
}
