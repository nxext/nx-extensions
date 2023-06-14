import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { ApplicationGeneratorSchema } from '../schema';

export async function addReact(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  ensurePackage('@nx/react', NX_VERSION);
  const { applicationGenerator } = await import('@nx/react');
  return await applicationGenerator(host, {
    ...options,
    name: options.name,
    style: 'css',
    skipFormat: options.skipFormat,
    directory: options.directory,
    unitTestRunner: options.unitTestRunner,
    e2eTestRunner: options.e2eTestRunner,
    linter: Linter.EsLint,
    pascalCaseFiles: true,
    classComponent: false,
    routing: true,
    globalCss: true,
    bundler: options.bundler,
  });
}
