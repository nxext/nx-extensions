import { CompilerSystem, ConfigFlags, Logger, TaskCommand } from '@stencil/core/cli';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { ConfigAndPathCollection, CoreCompiler } from './types';
import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import * as path from 'path';

const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

export interface StencilBaseConfigOptions {
  configPath: string;
  outputPath: string;
}

export async function initializeStencilConfig<T extends StencilBaseConfigOptions>(
  taskCommand: TaskCommand,
  options: T,
  context: ExecutorContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: T
  ) => ConfigFlags
): Promise<ConfigAndPathCollection> {
  const configFilePath = options.configPath;

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger({ process });
  const sys: CompilerSystem = createNodeSys({ process });

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.enableColors(false);
  }

  const loadConfigResults = await loadConfig({
    config: {
      flags
    },
    configPath: path.join(context.root, configFilePath),
    logger,
    sys
  });
  const coreCompiler = await loadCoreCompiler(sys);

  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(`${context.root}/${projectDir}`);
  const distDir = joinPathFragments(`${context.root}/${options.outputPath}`);

  return {
    projectName: context.projectName,
    config: loadConfigResults.config,
    projectRoot: projectRoot,
    distDir: distDir,
    pkgJson: joinPathFragments(`${projectRoot}/package.json`),
    coreCompiler: coreCompiler
  } as ConfigAndPathCollection;
}
