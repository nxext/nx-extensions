import { VitestExecutorOptions } from './schema';
import { ExecutorContext, joinPathFragments } from '@nx/devkit';

export default async function runExecutor(
  options: VitestExecutorOptions,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  // Really weird workaround to prevent that typescript transpiles the import to require
  // https://github.com/microsoft/TypeScript/issues/43329#issuecomment-922544562
  const { startVitest } = await (Function(
    'return import("vitest/node")'
  )() as Promise<typeof import('vitest/node')>);
  const result = await startVitest(options.vitestMode, [], {
    ...options,
    root: projectRoot,
  } as any);

  return { success: true };
}
