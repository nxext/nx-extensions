import { SveltekitExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export default async function runExecutor(
  options: SveltekitExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  await runCommands({
    command: `svelte-kit ${options.command}`,
    cwd: projectRoot,
    parallel: false,
    color: true
  }, context);

  return {
    success: true
  };
}

