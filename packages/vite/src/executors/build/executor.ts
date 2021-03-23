import { BuildExecutorSchema } from './schema';
import { build } from 'vite';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { relative } from 'path';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  try {
    await build({
      root: projectRoot,
      build: {
        outDir: relative(projectRoot, joinPathFragments(`${context.root}/dist/${projectDir}`)),
        emptyOutDir: true
      }
    });
  } catch (error) {
    return {
      success: false
    };
  }

  return {
    success: true
  };
}
