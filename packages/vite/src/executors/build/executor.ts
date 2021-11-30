import { BuildExecutorSchema } from './schema';
import { build, InlineConfig } from 'vite';
import { ExecutorContext, joinPathFragments, logger } from '@nrwl/devkit';
import { relative } from 'path';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);

  let buildConfig: InlineConfig = {
    root: projectRoot,
    build: {
      outDir: relative(projectRoot, joinPathFragments(`${context.root}/dist/${projectDir}`)),
      emptyOutDir: true
    }
  };

  if (options.configFile) {
    const configFile = joinPathFragments(`${context.root}/${options.configFile}`);
    buildConfig = {
      ...buildConfig,
      configFile
    };
  }

  try {
    await build(buildConfig);

    logger.info('Bundle complete.');
  } catch (error) {
    logger.error(`Error during bundle: ${error}`);

    return {
      success: false
    };
  }

  return {
    success: true
  };
}
