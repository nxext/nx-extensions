import { StencilServeOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  prepareConfigAndOutputargetPaths,
  initializeStencilConfig,
  createStencilProcess,
} from '../stencil-runtime';
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';
import { ExecutorContext, logger } from '@nx/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nx/workspace/src/utilities/buildable-libs-utils';
import { cleanupE2eTesting } from '../stencil-runtime/e2e-testing';

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
  const { strictConfig, pathCollection } = await initializeStencilConfig(
    taskCommand,
    options,
    context,
    flags
  );

  const config = await prepareConfigAndOutputargetPaths(
    strictConfig,
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
    await createStencilProcess(config);

    if (config.flags.e2e) {
      cleanupE2eTesting(pathCollection);
    }

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
