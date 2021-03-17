import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nrwl/devkit';
import { hasNxPackage, readNxVersion } from './util';

export function addLinterPlugin(tree: Tree): GeneratorCallback {
  const hasNrwlLinterDependency: boolean = hasNxPackage(tree, '@nrwl/linter');

  if (!hasNrwlLinterDependency) {
    const nxVersion = readNxVersion(tree);

    return addDependenciesToPackageJson(
      tree,
      {},
      {
        '@nrwl/linter': nxVersion
      }
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
}
