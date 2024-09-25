import { Tree } from '@nx/devkit';
import { capacitorConfigurationGenerator } from '@nxext/capacitor';
import { ConfigurationGeneratorSchema } from '../schema';

export async function addCapacitor(host: Tree, options: ConfigurationGeneratorSchema) {
  if (options.capacitor) {
    return await capacitorConfigurationGenerator(host, {
      project: options.project,
      appName: options.project,
      appId: 'io.ionic.starter',
      skipFormat: options.skipFormat,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
}
