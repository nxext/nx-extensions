import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilBuilderOptions } from './schema';
import {
  Config,
  ConfigFlags,
  createNodeLogger,
  createNodeSystem,
  Logger,
  parseFlags,
  runTask,
  TaskCommand
} from '@stencil/core/cli';
import { projectRootDir } from '@nrwl/workspace';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilBuilderOptions
): ConfigFlags {
  const runOptions: string[] = [
    taskCommand
  ];
  if(options.port) {
    runOptions.push(`--port ${options.port}`);
  }

  Object.keys(options).forEach(optionKey => {
    if(typeof options[optionKey] === "boolean" && options[optionKey]) {
      runOptions.push(`--${optionKey}`)
    }
  });

  return parseFlags(runOptions);
}

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

async function createStencilProcess(
  options: StencilBuilderOptions,
  context: BuilderContext
): Promise<void> {
  const taskCommand: TaskCommand = 'build';

  const flags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger(process);
  const sys = createNodeSystem(process);

  context.logger.info(JSON.stringify(flags));

  if (flags.ci) {
    logger.colors = false;
  }

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  const projectDir = projectRootDir(options.projectType);
  const { loadConfig } = await import('@stencil/core/compiler');
  const config: Config = (await loadConfig({
    config: {
      flags
    },
    configPath: `${projectDir}/${context.target.project}/stencil.config.ts`,
    logger,
    sys
  })).config;

  return await runTask(process, config, config.flags.task);
}

export function runBuilder(
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return new Observable<BuilderOutput>((obs) => {
    createStencilProcess(options, context)
      .then(() => obs.next({ success: true }))
      .catch((err) => obs.error(err));
  });
}

export default createBuilder(runBuilder);
