import { Tree } from '@nxext/devkit';
import { Linter } from '@nrwl/linter';
import { applicationGenerator } from '@nrwl/react';
import { ApplicationGeneratorSchema } from '../schema';

export async function addReact(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
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
  });
}
