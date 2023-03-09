import { Tree, ensurePackage } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { ApplicationGeneratorSchema } from '../schema';
import { readNxVersion } from '../../../utils/utils';

export async function addAngular(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  await ensurePackage(host, '@nrwl/angular', readNxVersion(host));
  const { applicationGenerator } = await import('@nrwl/angular/generators');
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
