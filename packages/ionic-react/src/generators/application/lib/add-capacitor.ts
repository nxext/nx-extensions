import { Tree } from '@nx/devkit';
import { capacitorConfigurationGenerator } from '@nxext/capacitor';
import { NormalizedSchema } from '../schema';

export async function addCapacitor(host: Tree, options: NormalizedSchema) {
  return await capacitorConfigurationGenerator(host, {
    project: options.appProjectName,
    appName: options.appName,
    appId: 'io.ionic.starter',
    skipFormat: options.skipFormat,
  });
}
