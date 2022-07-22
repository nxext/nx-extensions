import { Tree } from '@nrwl/devkit';
import { capacitorProjectGenerator } from '@nxext/capacitor';
import { NormalizedSchema } from '../schema';

export async function addCapacitor(host: Tree, options: NormalizedSchema) {
  return await capacitorProjectGenerator(host, {
    project: options.appProjectName,
    appName: options.appName,
    appId: 'io.ionic.starter',
    skipFormat: options.skipFormat,
  });
}
