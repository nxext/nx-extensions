import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { StencilBuilderOptions } from './schema';
import {
  TaskCommand
} from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess } from '../core/stencilCompiler';

export function runBuilder(
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'build';
  return createStencilConfig(taskCommand, options, context).pipe(
    createStencilProcess()
  );
}

export default createBuilder(runBuilder);
