import { Linter, lintProjectGenerator } from '@nrwl/linter';
import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';

import { NormalizedSchema } from '../schema';
import { extendVueEslintJson, extraEslintDependencies } from '../../utils/lint';
import { updateJson } from 'nx/src/generators/utils/json';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter === Linter.EsLint) {
    const lintTask = await lintProjectGenerator(host, {
      linter: options.linter,
      project: options.projectName,
      tsConfigPaths: [
        joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
      ],
      unitTestRunner: options.unitTestRunner,
      eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`],
      skipFormat: true,
    });

    updateJson(
      host,
      joinPathFragments(options.projectRoot, '.eslintrc.json'),
      extendVueEslintJson
    );

    const installTask = await addDependenciesToPackageJson(
      host,
      extraEslintDependencies.dependencies,
      extraEslintDependencies.devDependencies
    );

    return runTasksInSerial(lintTask, installTask);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
}
