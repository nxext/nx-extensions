import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilBuilderOptions } from './schema';
import {
  createNodeLogger, createNodeSystem,
  run,
  TaskCommand
} from '@stencil/core/cli';
import { projectRootDir } from '@nrwl/workspace';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilBuilderOptions,
  context: BuilderContext
): string[] {
  const projectDir = projectRootDir(options.projectType);
  const runOptions = [
    '',
    '',
    'build',
    '--config',
    `${projectDir}/${context.target.project}/stencil.config.ts`
  ];
  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }

  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}

export function createStencilProcessOriginalRun(taskCommand: TaskCommand,
                                                options: StencilBuilderOptions,
                                                context: BuilderContext) {
  return new Observable<BuilderOutput>((obs) => {
    process.argv = createStencilCompilerOptions(taskCommand, options, context);

    run({
      process: process,
      logger: createNodeLogger(process),
      sys: createNodeSystem(process)
    })
      .then(() => obs.next({ success: true }))
      .catch(err => obs.error(err));
  });
}

export function runBuilder(
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'build';
  return createStencilProcessOriginalRun(taskCommand, options, context);
}

export default createBuilder(runBuilder);
