import { applicationGenerator } from '@nrwl/angular/generators';
import { Tree } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { ApplicationGeneratorSchema } from '../schema';

export async function addAngular(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  return await applicationGenerator(host, {
    ...options,
    name: options.name,
    skipFormat: options.skipFormat,
    routing: true,
    style: 'scss',
    linter: Linter.EsLint,
    unitTestRunner: options.unitTestRunner,
    e2eTestRunner: options.e2eTestRunner,
  });
}
