import { StencilBuildOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess, initializeStencilConfig } from '../stencil-runtime';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext } from '@nrwl/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt, updateBuildableProjectPackageJsonDependencies
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilBuildOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];

  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export default async function runExecutor(
  options: StencilBuildOptions,
  context: ExecutorContext
) {
  const taskCommand: TaskCommand = 'build';
  context.target.executor = 'build';

  const projGraph = createProjectGraph();
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  if (!checkDependentProjectsHaveBeenBuilt(
    context.root,
    context.projectName,
    context.targetName,
    dependencies
  )) {
    return { success: false };
  }

  return run(taskCommand, options, context, dependencies, target);
}

async function run(taskCommand,
                   options,
                   context: ExecutorContext,
                   dependencies,
                   target) {
  const configAndPathCollection = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  );
  const stencilConfig = await createStencilConfig(
    configAndPathCollection
  );

  if (dependencies.length > 0 && context.target.executor !== 'serve') {
    updateBuildableProjectPackageJsonDependencies(
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName,
      target,
      dependencies
    );
  }

  return await createStencilProcess(stencilConfig, configAndPathCollection);
}
