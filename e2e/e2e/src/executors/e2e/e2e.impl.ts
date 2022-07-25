import 'dotenv/config';

import type { ExecutorContext } from '@nrwl/devkit';

import { logger } from '@nrwl/devkit';
import { jestExecutor } from '@nrwl/jest/src/executors/jest/jest.impl';
import type { NxPluginE2EExecutorOptions } from './schema';
import { ChildProcess, execSync } from 'child_process';
import {
  buildAllPackages,
  publishPackages,
  startVerdaccio,
} from '../../utils/registry';
import { cleanupAll, updatePackageJsonFiles } from '../../utils';
import { logError, logInfo, logSuccess } from '../../utils/logger';
import * as kill from 'kill-port';
import { check as portCheck } from 'tcp-port-used';

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

  //if (options.ci) {
  console.log('Authenticating to NPM');
  execSync(`npm adduser`, {
    stdio: [0, 1, 2],
  });
  //}

  try {
    buildAllPackages();
    updatePackageJsonFiles('999.9.9', true);
    publishPackages();

    success = await runTests(options.jestConfig, context);
  } catch (e) {
    logger.error(e.message);
    success = false;
  }

  try {
    child.kill();
  } catch (e) {
    await killPort(4873);
  }

  return { success };
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

const KILL_PORT_DELAY = 5000;

async function killPort(port: number): Promise<boolean> {
  if (await portCheck(port)) {
    try {
      logInfo(`Attempting to close port ${port}`);
      await kill(port);
      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), KILL_PORT_DELAY)
      );
      if (await portCheck(port)) {
        logError(`Port ${port} still open`);
      } else {
        logSuccess(`Port ${port} successfully closed`);
        return true;
      }
    } catch {
      logError(`Port ${port} closing failed`);
    }
    return false;
  } else {
    return true;
  }
}

export default nxPluginE2EExecutor;
