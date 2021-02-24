import { Schema } from './schema';
import { addDependenciesToPackageJson, convertNxGenerator, formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { cypressInitGenerator } from '@nrwl/cypress';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'svelte-jester': '^1.3.0',
      'svelte': '^3.32.3',
      'svelte-check': '^1.1.34',
      'svelte-preprocess': '^4.6.8',
      '@tsconfig/svelte': '^1.0.10'
    }
  );
}

export async function initGenerator(tree: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(tree, {});
    tasks.push(jestTask);
  }
  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
    const cypressTask = cypressInitGenerator(tree);
    tasks.push(cypressTask);
  }

  const installTask = updateDependencies(tree);
  tasks.push(installTask);

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }
  return runTasksInSerial(...tasks);
}

export const initSchematic = convertNxGenerator(initGenerator);
