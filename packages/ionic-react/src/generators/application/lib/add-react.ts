import { Tree, ensurePackage } from '@nx/devkit';
import { Linter } from '@nx/linter';
import { ApplicationGeneratorSchema } from '../schema';
import { readNxVersion } from '../../../utils/utils';

export async function addReact(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  await ensurePackage(host, '@nrwl/react', readNxVersion(host));
  const { applicationGenerator } = await import('@nrwl/react');
  return await applicationGenerator(host, {
    ...options,
    name: options.name,
    style: 'css',
    skipFormat: options.skipFormat,
    directory: options.directory,
    unitTestRunner: options.unitTestRunner,
    babelJest: false,
    e2eTestRunner: options.e2eTestRunner,
    linter: Linter.EsLint,
    pascalCaseFiles: true,
    classComponent: false,
    routing: true,
    skipWorkspaceJson: true,
    globalCss: true,
    bundler: options.bundler,
  });
}
