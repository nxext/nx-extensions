import {
  Config,
  ConfigFlags,
  createNodeLogger,
  createNodeSystem,
  Logger,
  runTask,
  TaskCommand,
} from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { projectRootDir } from '@nrwl/workspace';
import { loadConfig } from '@stencil/core/compiler';
import { map, switchMap } from 'rxjs/operators';
import { StencilTestOptions } from '../test/schema';
import { StencilE2EOptions } from '../e2e/schema';

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

export function createStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: StencilBuildOptions
  ) => ConfigFlags
): Observable<Config> {
  const projectDir = projectRootDir(options.projectType);

  let configFilePath = `${projectDir}/${context.target.project}/stencil.config.ts`;

  if (options.configPath) {
    configFilePath = options.configPath;
  }

  const flags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger(process);
  const sys = createNodeSystem(process);

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.colors = false;
  }

  return from(
    loadConfig({
      config: {
        flags,
      },
      configPath: configFilePath,
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

export function parseRunParameters(
  runOptions: string[],
  options: StencilBuildOptions | StencilTestOptions | StencilE2EOptions
) {
  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
