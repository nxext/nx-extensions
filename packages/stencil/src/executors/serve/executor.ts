import { StencilServeOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  prepareConfigAndOutputargetPaths,
  initializeStencilConfig,
  createStencilProcess,
} from '../stencil-runtime';
import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext, logger } from '@nxext/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilServeOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];
  runOptions = parseRunParameters(runOptions, options);

  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }
  if (options.docsReadme) {
    runOptions.push(`--docs-readme`);
  }
  if (options.noOpen) {
    runOptions.push(`--no-open`);
  }
  if (options.maxWorkers) {
    runOptions.push(`--max-workers ${options.maxWorkers}`);
  }
  runOptions.push('--serve');
  runOptions.push('--watch');

  return parseFlags(runOptions);
}

export const isString = (v: any): v is string => typeof v === 'string';

export default async function* runExecutor(
  options: StencilServeOptions,
  context: ExecutorContext
) {
  const taskCommand: TaskCommand = 'build';

  const projGraph = await createProjectGraphAsync();
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  if (
    !checkDependentProjectsHaveBeenBuilt(
      context.root,
      context.projectName,
      context.targetName,
      dependencies
    )
  ) {
    yield { success: false };
  }

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const { loadedConfig, pathCollection } = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    flags,
    dependencies
  );

  const config = await prepareConfigAndOutputargetPaths(
    loadedConfig,
    pathCollection
  );

  updateBuildableProjectPackageJsonDependencies(
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName,
    target,
    dependencies
  );

  try {
    await createStencilProcess(config, pathCollection);

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
