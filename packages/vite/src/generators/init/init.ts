import {
  addDependenciesToPackageJson,
  Tree,
  updateJson,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { viteVersion } from '../../utils/version';
import { Schema } from './schema';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

function removeViteFromDeps(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    delete json.dependencies['@nxext/vite'];
    return json;
  });
}

export async function viteInitGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(schema);
  setDefaultCollection(tree, '@nxext/vite');

  let jestInstall: GeneratorCallback;
  if (options.unitTestRunner === 'jest') {
    jestInstall = await jestInitGenerator(tree, {});
  }

  removeViteFromDeps(tree);

  const installTask = addDependenciesToPackageJson(
    tree,
    {
      vite: viteVersion,
    },
    {}
  );
  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return async () => {
    if (jestInstall) {
      await jestInstall();
    }
    await installTask();
  };
}

export default viteInitGenerator;
export const initSchematic = convertNxGenerator(viteInitGenerator);
