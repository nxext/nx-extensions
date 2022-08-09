import 'dotenv/config';

import type { ExecutorContext } from '@nrwl/devkit';
import { logger } from '@nrwl/devkit';
import { jestExecutor } from '@nrwl/jest/src/executors/jest/jest.impl';
import type { NxPluginE2EExecutorOptions } from './schema';
import { ChildProcess } from 'child_process';
import {
  buildAllPackages,
  login,
  publishPackages,
  startVerdaccio,
} from '../../utils/registry';
import { cleanupAll, killPort, updatePackageJsonFiles } from '../../utils';
import * as isCI from 'is-ci';
import { ensureDirSync } from 'fs-extra';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';

// eslint-disable-next-line require-yield
export async function* nxPluginE2EExecutor(
  options: NxPluginE2EExecutorOptions,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  process.env.npm_config_registry = `http://localhost:4872/`;
  process.env.YARN_REGISTRY = process.env.npm_config_registry;

  let success: boolean;
  ensureDirSync(tmpProjPath());
  cleanupAll();

  let child: ChildProcess;
  try {
    child = await startVerdaccio();
  } catch (e) {
    logger.info(`Verdaccio already running...`);
  }

  if (isCI) {
    console.log('Authenticating to NPM');
    login('test', 'test', '4872');
  }

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
    await killPort(4872);
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

export default nxPluginE2EExecutor;
