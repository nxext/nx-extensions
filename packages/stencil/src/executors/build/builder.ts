import { StencilBuildOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { prepareConfigAndOutputargetPaths, createStencilProcess, initializeStencilConfig } from '../stencil-runtime';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext } from '@nrwl/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies
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

  const { config, pathCollection } = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  );

  const stencilConfig = await prepareConfigAndOutputargetPaths(config, pathCollection);

  updateBuildableProjectPackageJsonDependencies(
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName,
    target,
    dependencies
  );

  return await createStencilProcess(stencilConfig, pathCollection);
}
