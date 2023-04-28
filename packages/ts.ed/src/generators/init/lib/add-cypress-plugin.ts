import {
  GeneratorCallback,
  Tree,
  runTasksInSerial,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import { hasNxPackage, readNxVersion } from './util';
import { cypressInitGenerator } from '@nx/cypress';

export async function addCypressPlugin(tree: Tree): Promise<GeneratorCallback> {
  const tasks: GeneratorCallback[] = [];
  const hasNrwlCypressDependency: boolean = hasNxPackage(tree, '@nx/cypress');

  if (!hasNrwlCypressDependency) {
    const nxVersion = readNxVersion(tree);

    const installTask = addDependenciesToPackageJson(
      tree,
      {},
      { '@nx/cypress': nxVersion }
    );
    tasks.push(installTask);
  }

  const cypressTask = await cypressInitGenerator(tree, {});
  tasks.push(cypressTask);

  return runTasksInSerial(...tasks);
}
