import {
  Config,
  ConfigFlags,
  createNodeLogger,
  createNodeSystem,
  Logger,
  parseFlags, runTask,
  TaskCommand
} from '@stencil/core/cli';
import { StencilBuilderOptions } from '../builders/stencil/schema';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { projectRootDir } from '@nrwl/workspace';
import { loadConfig } from '@stencil/core/compiler';
import { map, switchMap } from 'rxjs/operators';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilBuilderOptions
): ConfigFlags {
  const runOptions: string[] = [taskCommand];
  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }

  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return parseFlags(runOptions);
}

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

export function createStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<Config> {
  const flags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger(process);
  const sys = createNodeSystem(process);

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.colors = false;
  }

  const projectDir = projectRootDir(options.projectType);
  return from(
    loadConfig({
      config: {
        flags,
      },
      configPath: `${projectDir}/${context.target.project}/stencil.config.ts`,
      logger,
      sys,
    })
  ).pipe(map((loadConfigResults) => loadConfigResults.config));
}

export function createStencilProcess() {
  return function (source: Observable<Config>): Observable<BuilderOutput> {
    return source.pipe(
      switchMap(
        (config) =>
          new Observable<BuilderOutput>((obs) => {
            runTask(process, config, config.flags.task)
              .then(() => obs.next({ success: true }))
              .catch((err) => obs.error(err));
          })
      )
    );
  };
}
