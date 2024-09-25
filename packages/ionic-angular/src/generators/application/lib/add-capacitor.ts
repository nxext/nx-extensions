import { Tree } from '@nx/devkit';
import { capacitorProjectGenerator } from '@nxext/capacitor';
import { NormalizedSchema } from '../schema';

export async function addCapacitor(host: Tree, options: NormalizedSchema) {
  if (options.capacitor) {
    return await capacitorProjectGenerator(host, {
      project: options.appProjectName,
      appName: options.appName,
      appId: 'io.ionic.starter',
      skipFormat: options.skipFormat,
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
}
