import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilE2EOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess } from '../stencil-runtime';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';

function createStencilCompilerOptions(
  taskCommand: TaskCommand,
  options: StencilE2EOptions
): ConfigFlags {
  let runOptions: string[] = [taskCommand];
  runOptions.push(`--e2e`);
  runOptions = parseRunParameters(runOptions, options);

  return parseFlags(runOptions);
}

export function runBuilder(
  options: StencilE2EOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'test';

  return createStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  ).pipe(createStencilProcess(context));
}

export default createBuilder(runBuilder);
