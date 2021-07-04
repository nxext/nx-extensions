import { CompilerSystem, ConfigFlags, Logger, TaskCommand } from '@stencil/core/cli';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { PathCollection } from './types';
import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';
import { normalizePath } from '../../utils/normalize-path';
import type { Config } from '@stencil/core/compiler';

function getCompilerExecutingPath(): string {
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
): Promise<{
  pathCollection: PathCollection
  config: Config
}> {
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
  const projectRoot = normalizePath(join(context.root, projectDir));
  const distDir = normalizePath(join(context.root, options.outputPath));
  const configPath = normalizePath(join(context.root, options.configPath));

  let config = {
    flags
  };
  if (options.tsConfig) {
    const tsconfig = join(context.root, options.tsConfig);
    config = {
      ...config,
      ...{ tsconfig: tsconfig }
    };
  }

  const loadConfigResults = await loadConfig({
    config,
    configPath,
    logger,
    sys
  });
  const loadedConfig = loadConfigResults.config;

  if (loadedConfig.flags.task === 'build') {
    loadedConfig.rootDir = distDir;
    loadedConfig.packageJsonFilePath = normalizePath(join(distDir, 'package.json'));
  }

  return {
    pathCollection: {
      projectName: context.projectName,
      projectRoot: projectRoot,
      distDir: distDir,
      pkgJson: join(projectRoot, 'package.json')
    },
    config: loadedConfig
  };
}
