import { VitestExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export default async function runExecutor(
  options: VitestExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const result = await runCommands(
    {
      command: `vitest ${options.command}`,
      cwd: projectRoot,
      parallel: false,
      color: true,
    },
    context
  );

  if (result.success) {
    logger.info('Tests executed...');
  } else {
    logger.error('Error while testing...');
  }

  return result;
}
