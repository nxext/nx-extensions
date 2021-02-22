import {
  CompilerSystem,
  ConfigFlags,
  Logger,
  TaskCommand,
} from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import { StencilTestOptions } from '../test/schema';
import { BuilderContext } from '@angular-devkit/architect';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { loadConfig } from '@stencil/core/compiler';
import { getSystemPath, join, normalize, Path } from '@angular-devkit/core';
import { ConfigAndPathCollection, CoreCompiler } from './types';

const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

export async function initializeStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: StencilBuildOptions
  ) => ConfigFlags
) {
  const configFilePath = options.configPath;

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger({ process });
  const sys: CompilerSystem = createNodeSys({ process });
  const metadata = await context.getProjectMetadata(context.target);

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.enableColors(false);
  }

  const loadConfigResults = await loadConfig({
    config: {
      flags,
    },
    configPath: getSystemPath(
      join(normalize(context.workspaceRoot), configFilePath)
    ),
    logger,
    sys,
  });
  const coreCompiler = await loadCoreCompiler(sys);

  const { workspaceRoot } = context;
  const projectName: string = context.target.project;
  const distDir: Path = normalize(`${workspaceRoot}/${options.outputPath}`);
  const projectRoot: Path = normalize(`${workspaceRoot}/${metadata.root}`);

  return {
    projectName: projectName,
    config: loadConfigResults.config,
    projectRoot: getSystemPath(projectRoot),
    distDir: getSystemPath(distDir),
    pkgJson: getSystemPath(join(projectRoot, `package.json`)),
    coreCompiler: coreCompiler,
  } as ConfigAndPathCollection;
}
