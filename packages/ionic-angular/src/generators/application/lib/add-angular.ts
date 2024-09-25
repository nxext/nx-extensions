import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { ApplicationGeneratorSchema } from '../schema';

export async function addAngular(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  ensurePackage('@nx/angular', NX_VERSION);
  const { applicationGenerator } = await import('@nx/angular/generators');
  return await applicationGenerator(host, {
    ...options,
    name: options.name,
    directory: options.directory,
    skipFormat: true,
    routing: true,
    style: 'scss',
    linter: Linter.EsLint,
    unitTestRunner: options.unitTestRunner,
    e2eTestRunner: options.e2eTestRunner,
    standalone: options.standalone,
    minimal: true,
    bundler: 'webpack',
  });
}
