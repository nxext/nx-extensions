import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { lintProjectGenerator } from '@nx/eslint';
import {
  addSvelteEslintConfig,
  extraEslintDependencies,
} from '../../utils/lint';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    unitTestRunner: options.unitTestRunner,
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,svelte,spec.ts}`],
    skipFormat: true,
  });

  addSvelteEslintConfig(host, options.projectRoot);

  const installTask = addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
