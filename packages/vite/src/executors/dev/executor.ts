import { DevExecutorSchema } from './schema';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { createServer } from 'vite';
import { relative } from 'path';
import { RollupWatcherEvent } from 'rollup';

export default async function runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  const server = await createServer({
    root: projectRoot,
    build: {
      outDir: relative(projectRoot, joinPathFragments(`${context.root}/dist/${projectDir}`)),
      emptyOutDir: true
    }
  });

  const devProcess = await server.listen();
  await new Promise<void>((resolve, reject) => {
    devProcess.watcher.on('event', (data: RollupWatcherEvent) => {
      if (data.code === 'END') {
        resolve()
      } else if (data.code === 'ERROR') {
        reject()
      }
    });
  });

  await devProcess.close();

  return { success: true };
}

