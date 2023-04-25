import { StencilE2EOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  prepareConfigAndOutputargetPaths,
  createStencilProcess,
  initializeStencilConfig,
} from '../stencil-runtime';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext, logger } from '@nx/devkit';
import { cleanupE2eTesting } from '../stencil-runtime/e2e-testing';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilE2EOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];
  runOptions.push(`--e2e`);
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export default async function runExecutor(
  options: StencilE2EOptions,
  context: ExecutorContext
) {
  const taskCommand: TaskCommand = 'test';

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const { strictConfig, pathCollection } = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    flags
  );
  const stencilConfig = await prepareConfigAndOutputargetPaths(
    strictConfig,
    pathCollection
  );

  try {
    await createStencilProcess(stencilConfig);

    if (stencilConfig.flags.e2e) {
      cleanupE2eTesting(pathCollection);
    }

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
