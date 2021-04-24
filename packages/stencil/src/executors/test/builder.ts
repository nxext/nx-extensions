import { StencilTestOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess, initializeStencilConfig } from '../stencil-runtime';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext } from '@nrwl/devkit';

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
