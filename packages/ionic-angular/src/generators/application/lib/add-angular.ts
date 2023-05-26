import { Tree } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { ApplicationGeneratorSchema } from '../schema';

export async function addAngular(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  //ensurePackage('@nx/angular', NX_VERSION);
  const { applicationGenerator } = await import('@nx/angular/generators');
  return await applicationGenerator(host, {
    ...options,
    name: options.name,
    skipFormat: options.skipFormat,
    routing: true,
    style: 'scss',
    linter: Linter.EsLint,
    unitTestRunner: options.unitTestRunner,
    e2eTestRunner: options.e2eTestRunner,
    standalone: options.standalone,
    minimal: true,
  });
}
