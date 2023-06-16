import { Tree } from '@nx/devkit';
import { PresetSchema } from './schema';
import { applicationGenerator } from '../application/application';

export default async function (host: Tree, options: PresetSchema) {
  return await applicationGenerator(host, {
    name: options.vueAppName,
    tags: options.tags,
    directory: options.directory,
    linter: options.linter,
    skipFormat: options.skipFormat,
    unitTestRunner: options.unitTestRunner,
    e2eTestRunner: options.e2eTestRunner,
    rootProject: options.standalone,
  });
}
