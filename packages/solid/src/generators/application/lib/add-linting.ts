import {
  addDependenciesToPackageJson,
  ensurePackage,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';
import {
  extendSolidEslintJson,
  extraEslintDependencies,
} from '../../utils/lint';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { readNxVersion } from '../../init/lib/util';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter === 'none') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nrwl/linter', readNxVersion(host));
  const { lintProjectGenerator } = await import('@nrwl/linter');

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.appProjectRoot}/**/*.{ts,spec.ts,tsx}`],
    skipFormat: true,
    rootProject: options.rootProject,
  });

  updateJson(
    host,
    joinPathFragments(options.appProjectRoot, '.eslintrc.json'),
    extendSolidEslintJson
  );

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
