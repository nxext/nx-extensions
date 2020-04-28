import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StencilBuilderOptions } from './schema';
import { run, createNodeLogger, createNodeSystem } from '@stencil/core/cli';
import { projectRootDir } from '@nrwl/workspace';

function createStencilCompilerOptions(
  options: StencilBuilderOptions,
  context: BuilderContext
) {
  const projectDir = projectRootDir(options.projectType);
  const runOptions = [
    '',
    '',
    'build',
    '--config',
    `${projectDir}/${context.target.project}/stencil.config.ts`,
  ];

  if (options.dev) {
    runOptions.push('--dev');
  }

  if (options.watch) {
    runOptions.push('--watch');
  }

  if (options.serve) {
    runOptions.push('--serve');
  }

  return runOptions;
}

function createStencilProcess(
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<any> {
  process.argv = createStencilCompilerOptions(options, context);
  return new Observable<any>((obs) => {
    run({
      process: process,
      logger: createNodeLogger(process),
      sys: createNodeSystem(process),
    })
      .then((sucess) => obs.next(sucess))
      .catch((err) => obs.error(err));
  });
}

export function runBuilder(
  options: StencilBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return createStencilProcess(options, context).pipe(
    map((loaded) => {
      const builder: BuilderOutput = { success: true } as BuilderOutput;
      return builder;
    })
  );
}

export default createBuilder(runBuilder);
