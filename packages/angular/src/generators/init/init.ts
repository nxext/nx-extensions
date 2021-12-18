import {
  Tree,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { angularInitGenerator as nxAngularInitGenerator } from '@nrwl/angular/src/generators/init/init';
import { viteInitGenerator } from '@nxext/vite';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { Schema } from './schema';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function angularInitGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(schema);

  let jestInstall: GeneratorCallback;
  if (options.unitTestRunner === 'jest') {
    jestInstall = await jestInitGenerator(tree, {});
  }

  await nxAngularInitGenerator(tree, {
    ...options,
  }).then(() => setDefaultCollection(tree, '@nxext/angular'));
  await viteInitGenerator(tree, options);

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return async () => {
    if (jestInstall) {
      await jestInstall();
    }
  };
}

export default angularInitGenerator;
export const angularSchematic = convertNxGenerator(angularInitGenerator);
