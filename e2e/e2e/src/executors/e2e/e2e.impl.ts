import 'dotenv/config';

import type { ExecutorContext } from '@nrwl/devkit';
import { logger, parseTargetString, runExecutor } from '@nrwl/devkit';
import type { NxPluginE2EExecutorOptions } from './schema';
import { ChildProcess } from 'child_process';
import {
  addUser,
  buildAllPackages,
  publishPackages,
  startVerdaccio,
} from '../../utils/registry';
import {
  cleanupVerdaccio,
  killPort,
  updatePackageJsonFiles,
} from '../../utils';

export async function* nxPluginE2EExecutor(
  options: NxPluginE2EExecutorOptions,
  context: ExecutorContext
) {
  const verdaccioPort = options.verdaccioPort || 4872;
  const verdaccioUrl = `http://localhost:${verdaccioPort}/`;
  process.env.npm_config_registry = verdaccioUrl;
  process.env.YARN_REGISTRY = verdaccioUrl;

  cleanupVerdaccio();

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
    buildAllPackages('e2e,docs,angular-vite,angular-nx,angular-swc');
    updatePackageJsonFiles('999.9.9', true);
    publishPackages(verdaccioUrl, 'dist/packages');

    const target = `${context.projectName}:${options.testTarget}`;
    const delegateTarget = parseTargetString(target);
    yield* await runExecutor(delegateTarget, {}, context);
  } catch (e) {
    logger.error(e.message);
  }

  try {
    child.kill();
  } catch (e) {
    await killPort(verdaccioPort);
  }

  cleanupVerdaccio();
}

export default nxPluginE2EExecutor;
