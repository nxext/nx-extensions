import { ConfigFlags, Logger, TaskCommand } from '@stencil/core/cli';
import {
  CompilerSystem,
  createNodeLogger,
  createNodeSys,
} from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { PathCollection } from './types';
import { ExecutorContext } from '@nx/devkit';
import { join } from 'path';
import { normalizePath } from '../../utils/normalize-path';
import type { Config } from '@stencil/core/compiler';
import { ValidatedConfig } from '@stencil/core/internal';

function getCompilerExecutingPath(): string {
  return require.resolve('@stencil/core/compiler');
}

export interface StencilBaseConfigOptions {
  configPath: string;
  outputPath: string;
  tsConfig?: string;
}

export async function initializeStencilConfig<
  T extends StencilBaseConfigOptions
>(
  taskCommand: TaskCommand,
  options: T,
  context: ExecutorContext,
  flags: ConfigFlags
): Promise<{
  pathCollection: PathCollection;
  strictConfig: Config;
}> {
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
    flags,
  };
  if (options.tsConfig) {
    const tsconfig = join(context.root, options.tsConfig);
    config = {
      ...config,
      ...{ tsconfig: tsconfig },
    };
  }

  const loadConfigResults = await loadConfig({
    config,
    configPath,
    logger,
    sys,
  });
  const loadedConfig = loadConfigResults.config;
  const strictConfig: ValidatedConfig = {
    ...loadedConfig,
    flags: flags,
    logger,
    outputTargets: loadedConfig.outputTargets ?? [],
    rootDir: loadedConfig.rootDir ?? '/',
    sys: sys ?? loadedConfig.sys,
    testing: loadedConfig.testing ?? {},
  };

  if (strictConfig.flags.task === 'build') {
    strictConfig.rootDir = distDir;
    strictConfig.packageJsonFilePath = normalizePath(
      join(distDir, 'package.json')
    );
  }

  return {
    pathCollection: {
      projectName: context.projectName,
      projectRoot: projectRoot,
      distDir: distDir,
      pkgJson: join(projectRoot, 'package.json'),
    },
    strictConfig: strictConfig,
  };
}
