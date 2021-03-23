import { DevExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { LARGE_BUFFER } from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export default async function runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  /*
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  execSync("svelte-kit dev", {
    stdio: [0, 1, 2],
    maxBuffer: LARGE_BUFFER,
    cwd: projectRoot
  });
   */

  return {
    success: true
  }
}

