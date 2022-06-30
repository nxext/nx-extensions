import { StencilTestOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  prepareConfigAndOutputargetPaths,
  createStencilProcess,
  initializeStencilConfig,
} from '../stencil-runtime';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext, logger } from '@nxext/devkit';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilTestOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];
  runOptions.push(`--spec`);
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export default async function runExecutor(
  options: StencilTestOptions,
  context: ExecutorContext
) {
  const taskCommand: TaskCommand = 'test';

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const { loadedConfig, pathCollection } = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    flags
  );
  const stencilConfig = await prepareConfigAndOutputargetPaths(
    loadedConfig,
    pathCollection
  );

  try {
    await createStencilProcess(stencilConfig, pathCollection);

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
