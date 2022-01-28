import { Tree } from '@nrwl/devkit';
import { InitSchema } from '../schema';
import { jestInitGenerator } from '@nrwl/jest';

export async function addJest(host: Tree, options: InitSchema) {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return jestInitGenerator(host, {});
}
