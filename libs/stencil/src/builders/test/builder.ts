import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilTestOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  createStencilConfig,
  createStencilProcess,
  parseRunParameters,
} from '../compiler-utils/stencil-runtime';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilTestOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];
  runOptions.push(`--spec`);
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export function runBuilder(
  options: StencilTestOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'test';
  return createStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  ).pipe(createStencilProcess());
}

export default createBuilder(runBuilder);
