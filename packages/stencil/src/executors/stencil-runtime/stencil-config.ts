import { CompilerSystem, ConfigFlags, Logger, TaskCommand } from '@stencil/core/cli';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { ConfigAndPathCollection, CoreCompiler } from './types';
import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';

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
  tsConfig?: string;
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
  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger({ process });
  const sys: CompilerSystem = createNodeSys({ process });

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.enableColors(false);
  }

  const projectDir = context.workspace.projects[context.projectName].root;
  const projectRoot = join(context.root, projectDir);
  const distDir = join(context.root, options.outputPath);
  const configPath = join(context.root, options.configPath);

  let config = {
    flags,
  };
  if(options.tsConfig) {
    const tsconfig = join(context.root, options.tsConfig);
    config = {
      ...config,
      ...{ tsconfig: tsconfig }
    }
  }

  const loadConfigResults = await loadConfig({
    config,
    configPath,
    logger,
    sys
  });
  const coreCompiler = await loadCoreCompiler(sys);

  return {
    projectName: context.projectName,
    config: loadConfigResults.config,
    projectRoot: projectRoot,
    distDir: distDir,
    pkgJson: join(projectRoot, 'package.json'),
    coreCompiler: coreCompiler
  } as ConfigAndPathCollection;
}
