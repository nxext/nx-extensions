import {
  Tree,
  updateJson,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { Schema } from './schema';
import { addJestPlugin } from './lib/add-jest-plugin';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { updateDependencies } from './lib/add-dependencies';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

function removeViteFromDeps(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    delete json.dependencies['@nxext/vite'];
    delete json.dependencies['vite'];
    return json;
  });
}

export async function viteInitGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];
  const options = normalizeOptions(schema);
  setDefaultCollection(host, '@nxext/vite');

  if (options.unitTestRunner === 'jest') {
    const jestTask = addJestPlugin(host);
    tasks.push(jestTask);
  }

  removeViteFromDeps(host);

  const installTask = updateDependencies(host);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export default viteInitGenerator;
export const initSchematic = convertNxGenerator(viteInitGenerator);
