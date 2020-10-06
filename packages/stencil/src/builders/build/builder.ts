import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilBuildOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  createStencilConfig,
  createStencilProcess,
  parseRunParameters,
} from '../utils';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilBuildOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];

  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export function runBuilder(
  options: StencilBuildOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'build';
  return createStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  ).pipe(createStencilProcess());
}

export default createBuilder(runBuilder);
