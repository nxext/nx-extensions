import { ExecutorContext, normalizePath } from '@nrwl/devkit';
import runCommands, {
  RunCommandsOptions,
} from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { CommandExecutorSchema } from './schema';

export default async function runExecutor(
  options: CommandExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const projectRootPath = normalizePath(`${context.root}/${projectRoot}`);

  const cmd = sanitizeCapacitorCommand(options.cmd);

  const runCommandsOptions: RunCommandsOptions = {
    cwd: projectRootPath,
    command: `npx cap ${cmd}`,
    __unparsed__: [],
  };

  return await runCommands(runCommandsOptions, context);
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
