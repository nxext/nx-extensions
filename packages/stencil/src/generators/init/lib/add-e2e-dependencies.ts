import { PROJECT_TYPE_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import { InitSchema } from '../schema';

export async function addPuppeteer(tree: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'puppeteer') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const testDependencies = PROJECT_TYPE_DEPENDENCIES['puppeteer'];

  return addDependenciesToPackageJson(
    tree,
    testDependencies.dependencies,
    testDependencies.devDependencies
  );
}
