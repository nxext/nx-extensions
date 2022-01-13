import { SveltekitExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export default async function runExecutor(
  options: SveltekitExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const result = await runCommands({
    command: `svelte-kit ${options.command} -p ${options.port}`,
    cwd: projectRoot,
    parallel: false,
    color: true
  }, context);

  if(result.success) {
    logger.info('Build executed...');
  } else {
    logger.error('Error while building...');
  }

  return result;
}

