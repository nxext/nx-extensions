import { Tree, ensurePackage } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { ApplicationGeneratorSchema } from '../schema';
import { readNxVersion } from '../../../utils/utils';

export async function addAngular(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  ensurePackage('@nx/angular', readNxVersion(host));
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
    standalone: false,
  });
}
