import { CompilerSystem, ConfigFlags, Logger, TaskCommand } from '@stencil/core/cli';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { PathCollection } from './types';
import { ExecutorContext, readJsonFile } from '@nrwl/devkit';
import { join } from 'path';
import {
  fileExists
} from '@nrwl/workspace/src/utilities/fileutils';
import { normalizePath } from '../../utils/normalize-path';
import type { Config } from '@stencil/core/compiler';
import { hasError } from '../../utils/utillities';

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
  flags: ConfigFlags,
  dependencies = []
): Promise<{
  pathCollection: PathCollection
  config: Config
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
  dependencies = dependencies
    .filter(dep => dep.node.type == 'lib')
    .map(dep => {
      const pkgJsonPath = `${dep.outputs[0]}/package.json`;
      if(fileExists(pkgJsonPath)) {
        const pkgJson = readJsonFile(pkgJsonPath);
        return {
          name: pkgJson.name,
          version: pkgJson.name,
          main: pkgJson.main
        }
      }
    });

  await sys.ensureResources({ rootDir: loadedConfig.rootDir, logger, dependencies: dependencies as any });

  const ensureDepsResults = await sys.ensureDependencies({
    rootDir: loadedConfig.rootDir,
    logger,
    dependencies: dependencies as any,
  });

  logger.printDiagnostics(ensureDepsResults.diagnostics);
  if (hasError(ensureDepsResults.diagnostics)) {
    logger.printDiagnostics(ensureDepsResults.diagnostics);
    await sys.exit(1);
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
