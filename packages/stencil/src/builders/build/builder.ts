import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StencilBuildOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import { createStencilConfig, createStencilProcess } from '../stencil-runtime';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies
} from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { inspect } from 'util';
import { parseRunParameters } from '../stencil-runtime/stencil-parameters';

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

  const projGraph = createProjectGraph();
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context
  );

  if (!checkDependentProjectsHaveBeenBuilt(context, dependencies)) {
    return of({ success: false });
  }

  return createStencilConfig(
    taskCommand,
    options,
    context,
    createStencilCompilerOptions
  ).pipe(
    tap(() => {
      if (dependencies.length > 0) {
        context.logger.info(inspect(dependencies));
        updateBuildableProjectPackageJsonDependencies(
          context,
          target,
          dependencies
        );
      }
    }),
    createStencilProcess()
  );
}

export default createBuilder(runBuilder);
