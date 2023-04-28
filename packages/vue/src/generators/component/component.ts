import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { Schema } from './schema';
import { addExportsToBarrel } from './lib/add-exports-to-barrel';
import { normalizeOptions } from './lib/normalize-options';
import { createComponentFiles } from './lib/create-component-files';

export async function componentGenerator(tree: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  const options = normalizeOptions(tree, schema);
  createComponentFiles(tree, options);
  await formatFiles(tree);

  if (options.export) {
    addExportsToBarrel(tree, options);
  }

  return runTasksInSerial(...tasks);
}

export default componentGenerator;

export const componentSchematic = convertNxGenerator(componentGenerator);
