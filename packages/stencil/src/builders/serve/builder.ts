import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import {
  createStencilConfig,
  createStencilProcess,
  parseRunParameters,
} from '../utils';
import { StencilServeOptions } from './schema';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilServeOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];

  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }
  if (!options.open) {
    runOptions.push('--no-open');
  }
  runOptions.push('--serve');
  runOptions.push('--watch');

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
