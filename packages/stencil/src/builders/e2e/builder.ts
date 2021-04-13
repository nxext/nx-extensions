import { StencilE2EOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess, initializeStencilConfig } from '../stencil-runtime';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext } from '@nrwl/devkit';

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

  return await run(
    taskCommand,
    options,
    context
  );
}

async function run(taskCommand,
                   options,
                   context: ExecutorContext) {
  const configAndPathCollection = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  );
  const stencilConfig = await createStencilConfig(
    configAndPathCollection
  );

  return await createStencilProcess(stencilConfig, configAndPathCollection);
}
