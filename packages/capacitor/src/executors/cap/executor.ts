import {
  ExecutorContext,
  getPackageManagerCommand,
  logger,
  normalizePath,
  parseTargetString,
  readJsonFile,
  runExecutor as nxRunExecutor,
} from '@nx/devkit';
import runCommands, {
  RunCommandsOptions,
} from 'nx/src/executors/run-commands/run-commands.impl';
import { CommandExecutorSchema } from './schema';
import { existsSync, rmSync } from 'fs';

export default async function* runExecutor(
  options: CommandExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const projectRootPath = normalizePath(`${context.root}/${projectRoot}`);
  const projectDistPath = normalizePath(`${context.root}/dist/${projectRoot}`);
  const { devDependencies } = readJsonFile('package.json');
  const packageName = '@capacitor/cli';
  const packageVersion = devDependencies?.[packageName]?.replace(/[\\~^]/g, '');

  await runCommands(
    {
      command: getPackageManagerCommand().install,
      cwd: projectRootPath,
      parallel: false,
      color: true,
      __unparsed__: [],
    },
    context
  );

  if (!existsSync(projectDistPath)) {
    logger.info(`Running build first...`);

    const parsedDevServerTarget = parseTargetString(
      `${context.projectName}:build`,
      context.projectGraph
    );

    for await (const output of await nxRunExecutor<{
      success: boolean;
    }>(parsedDevServerTarget, {}, context)) {
      yield {
        success: output.success,
      };
    }
  }

  const cmd = sanitizeCapacitorCommand(options.cmd);

  const runCommandsOptions: RunCommandsOptions = {
    cwd: projectRootPath,
    command: `npx --package=${packageName}@${packageVersion} cap ${cmd}`,
    forwardAllArgs: true,
    __unparsed__: [],
  };

  const result = await runCommands(runCommandsOptions, context);

  const nodeModulesPath = normalizePath(`${projectRootPath}/node_modules`);
  if (existsSync(nodeModulesPath)) {
    try {
      logger.info(`\n\nRemoving node_modules from project root...`);
      rmSync(nodeModulesPath, { recursive: true, force: true });
    } catch (err) {
      logger.error(`\n\nFailed to remove node_modules from project root.`);
    }
  }

  return result;
}

/**
 * Strip quotes from the Capacitor command passed into the executor.
 * @param capacitorCommand The command input from the user.
 * @returns a string without quotes at the start or end.
 */
function sanitizeCapacitorCommand(capacitorCommand: string): string {
  let cmd = capacitorCommand;
  if (cmd[0] === '"' && cmd[cmd.length - 1] === '"') {
    cmd = cmd.substring(1).slice(0, -1);
  }

  return cmd;
}
