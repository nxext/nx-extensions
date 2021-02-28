import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';
import { lintProjectGenerator } from '@nrwl/linter';
import { extraEslintDependencies, svelteEslintJson } from '../../utils/lint';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });

  updateJson(
    host,
    joinPathFragments(options.projectRoot, '.eslintrc.json'),
    (json) => {
      json = { ...svelteEslintJson, ...json };
      return json;
    }
  );

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
