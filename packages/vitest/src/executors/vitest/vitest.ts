import { VitestExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';

export default async function runExecutor(
  options: VitestExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const vitest = await import('vitest/node');
  const result = await vitest.startVitest([], {
    ...options,
    root: projectRoot,
  } as any);

  return { success: result };
}
