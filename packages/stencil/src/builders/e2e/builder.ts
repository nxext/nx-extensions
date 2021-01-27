import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { StencilE2EOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  createStencilProcess,
  mapConfigPaths,
  prepareDistDirAndPkgJson,
  prepareE2eTesting,
  initializeStencilConfig
} from '@nxext/stencil-compiler-utils';
import { parseRunParameters } from '@nxext/stencil-compiler-utils';
import { map } from 'rxjs/operators';
import { ConfigAndPathCollection } from '@nxext/stencil-compiler-utils';

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
    createStencilProcess(context)
  );
}

export default createBuilder(runBuilder);
