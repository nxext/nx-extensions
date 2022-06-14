import { VitestExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { default as runCommands } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

function collectOptions(options: VitestExecutorOptions) {
  let cliOptions = '';
  if (options.passWithNoTests) {
    cliOptions += ' --passWithNoTests';
  }
  if (options.testNamePattern && options.testNamePattern != '') {
    cliOptions += ` --testNamePattern ${options.testNamePattern}`;
  }

  return cliOptions;
}

export default async function runExecutor(
  options: VitestExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const cliOptions = collectOptions(options);

  const result = await runCommands(
    {
      command: `vitest ${options.command} ${cliOptions}`,
      cwd: projectRoot,
      parallel: false,
      color: true,
      __unparsed__: [],
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
