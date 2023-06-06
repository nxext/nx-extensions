import { Tree } from '@nx/devkit';
import { PresetSchema } from './schema';
import { applicationGenerator } from '../application/application';

export default async function (host: Tree, options: PresetSchema) {
  options.name = options.vueAppName;

  return await applicationGenerator(host, options);
}
