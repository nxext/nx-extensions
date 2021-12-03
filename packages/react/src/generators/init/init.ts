import {
  Tree,
  formatFiles,
  convertNxGenerator,
  GeneratorCallback,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { reactInitGenerator as nxReactInitGenerator } from '@nrwl/react';
import { viteInitGenerator } from '@nxext/vite';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import { Schema } from './schema';

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function reactInitGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(schema);

  let jestInstall: GeneratorCallback;
  if (options.unitTestRunner === 'jest') {
    jestInstall = await jestInitGenerator(tree, {});
  }

  await nxReactInitGenerator(tree, {
    ...options,
    e2eTestRunner: 'none',
  }).then(() => setDefaultCollection(tree, '@nxext/react'));
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

export default reactInitGenerator;
export const reactSchematic = convertNxGenerator(reactInitGenerator);
