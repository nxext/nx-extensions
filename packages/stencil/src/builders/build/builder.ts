import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StencilBuildOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  prepareDistDirAndPkgJson,
  createStencilProcess,
  mapConfigPaths,
  initializeStencilConfig,
  prepareE2eTesting,
  ConfigAndPathCollection
} from '@nxext/stencil-compiler-utils';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies
} from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { parseRunParameters } from '@nxext/stencil-compiler-utils';

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
  context.target.target = 'build';

  const projGraph = createProjectGraph();
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context
  );

  if (!checkDependentProjectsHaveBeenBuilt(context, dependencies)) {
    return of({ success: false });
  }

  return from(
    initializeStencilConfig(
      taskCommand,
      options,
      context,
      createStencilCompilerOptions
    )
  ).pipe(
    prepareDistDirAndPkgJson(),
    prepareE2eTesting(),
    map((values: ConfigAndPathCollection) => {
      return mapConfigPaths(values);
    }),
    tap(() => {
      if (dependencies.length > 0 && context.target.target !== 'serve') {
        updateBuildableProjectPackageJsonDependencies(
          context,
          target,
          dependencies
        );
      }
    }),
    createStencilProcess(context)
  );
}

export default createBuilder(runBuilder);
