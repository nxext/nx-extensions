import 'dotenv/config';

import type { ExecutorContext } from '@nrwl/devkit';

import { logger } from '@nrwl/devkit';
import { jestExecutor } from '@nrwl/jest/src/executors/jest/jest.impl';
import type { NxPluginE2EExecutorOptions } from './schema';
import { ChildProcess } from 'child_process';
import {
  buildAllPackages,
  publishPackages,
  runRegistry,
} from '../../utils/registry';
import { cleanupAll, updatePackageJsonFiles } from '../../utils';

// eslint-disable-next-line require-yield
export async function* nxPluginE2EExecutor(
  options: NxPluginE2EExecutorOptions,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  let success: boolean;
  cleanupAll();

  let child: ChildProcess;
  try {
    child = await startVerdaccio();
  } catch (e) {
    logger.info(`Verdaccio already running...`);
  }
  buildAllPackages();
  updatePackageJsonFiles('999.9.9', true);
  publishPackages();

  try {
    success = await runTests(options.jestConfig, context);
  } catch (e) {
    logger.error(e.message);
    success = false;
    child.kill();
  }
  child.kill();

  return { success };
}

async function startVerdaccio() {
  const port = 4872;
  return runRegistry(
    [
      '-c',
      `${process.cwd()}/tools/scripts/local-registry/config.yml`,
      '-l',
      `${port}`,
    ],
    {}
  );
}

async function runTests(
  jestConfig: string,
  context: ExecutorContext
): Promise<boolean> {
  const { success } = await jestExecutor(
    {
      jestConfig,
      watch: false,
      runInBand: true,
      maxWorkers: 1,
      testTimeout: 120000,
    },
    context
  );

  return success;
}

export default nxPluginE2EExecutor;
