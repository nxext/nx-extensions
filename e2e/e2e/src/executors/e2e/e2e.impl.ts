import 'dotenv/config';

import type { ExecutorContext } from '@nrwl/devkit';
import { logger, parseTargetString, runExecutor } from '@nrwl/devkit';
import { jestExecutor } from '@nrwl/jest/src/executors/jest/jest.impl';
import type { NxPluginE2EExecutorOptions } from './schema';
import { ChildProcess } from 'child_process';
import {
  addUser,
  buildAllPackages,
  publishPackages,
  startVerdaccio,
} from '../../utils/registry';
import { cleanupAll, killPort, updatePackageJsonFiles } from '../../utils';
import { ensureDirSync } from 'fs-extra';
import { tmpProjPath } from '@nrwl/nx-plugin/testing';

// eslint-disable-next-line require-yield
export async function* nxPluginE2EExecutor(
  options: NxPluginE2EExecutorOptions,
  context: ExecutorContext
) {
  const verdaccioPort = options.verdaccioPort || 4872;
  const verdaccioUrl = `http://localhost:${verdaccioPort}/`;
  process.env.npm_config_registry = verdaccioUrl;
  process.env.YARN_REGISTRY = verdaccioUrl;

  ensureDirSync(tmpProjPath());
  cleanupAll();

  let child: ChildProcess;
  try {
    child = await startVerdaccio(options.verdaccioConfig);
  } catch (e) {
    logger.info(`Verdaccio already running...`);
  }

  try {
    // sometimes you need a dummy use on different environments. Add and ignore catch case
    await addUser(verdaccioUrl);
  } catch (e) {
    //
  }

  try {
    buildAllPackages();
    updatePackageJsonFiles('999.9.9', true);
    publishPackages(verdaccioUrl);

    const target = `${context.projectName}:${options.testTarget}`;
    const delegateTarget = parseTargetString(target);
    yield* await runExecutor(delegateTarget, {}, context);
  } catch (e) {
    logger.error(e.message);
  }

  try {
    child.kill();
  } catch (e) {
    await killPort(4872);
  }
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
