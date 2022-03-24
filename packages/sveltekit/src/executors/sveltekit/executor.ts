import { SveltekitExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export default async function runExecutor(
  options: SveltekitExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const portOption = options.command === 'dev' ? ` --port ${options.port}` : '';
  const projectOutput = joinPathFragments(
    context.root,
    'dist/packages/',
    context.projectName
  );

  const result = await runCommands(
    {
      cwd: projectRoot,
      commands: [
        {
          // creates folder if it doesn't exist
          // otherwhise cp command doesn't work
          command: `mkdir -p ${projectOutput}`,
          description: 'Creating output folder',
        },
        {
          command: 'cp package.json ../../dist/packages/' + context.projectName,
          description: 'coppying the package.json to dist',
        },
        // svelte-kit on serving, looks to the nearest parent package.json
        {
          command: `svelte-kit ${options.command}${portOption}`,
          description: 'Executing svelte-kit command',
        },
      ],
      parallel: false,
      color: true,
    },
    context
  );

  if (result.success) {
    logger.info('Build executed...');
  } else {
    logger.error('Error while building...');
  }

  return result;
}
