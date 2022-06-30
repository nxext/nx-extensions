import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
} from '@nxext/devkit';
import { lintProjectGenerator } from '@nrwl/linter';
import { extraEslintDependencies } from '../../utils/lint';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { NormalizedSchema } from '../schema';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter === 'none') {
    return runTasksInSerial();
  }

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,svelte,spec.ts}`],
    skipFormat: true,
  });

  host.rename(
    joinPathFragments(options.projectRoot, 'eslintrc.cjs'),
    joinPathFragments(options.projectRoot, '.eslintrc.cjs')
  );
  host.delete(joinPathFragments(options.projectRoot, '.eslintrc.json'));

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
