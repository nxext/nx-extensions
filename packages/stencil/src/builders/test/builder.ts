import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { StencilTestOptions } from './schema';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';
import {
  initializeStencilConfig,
  prepareE2eTesting,
  createStencilProcess,
  mapConfigPaths,
  prepareDistDirAndPkgJson
} from '@nxext/stencil-compiler-utils';
import { parseRunParameters } from '@nxext/stencil-compiler-utils';
import { map} from 'rxjs/operators';
import { ConfigAndPathCollection } from '@nxext/stencil-compiler-utils';

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
