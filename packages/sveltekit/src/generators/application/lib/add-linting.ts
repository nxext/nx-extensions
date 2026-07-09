import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  runTasksInSerial,
  NX_VERSION,
  ensurePackage,
} from '@nx/devkit';
import {
  addSvelteEslintConfig,
  extraEslintDependencies,
} from '../../utils/lint';
import { NormalizedSchema } from '../schema';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter === 'none') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const { lintProjectGenerator } = ensurePackage<typeof import('@nx/eslint')>(
    '@nx/eslint',
    NX_VERSION,
  );

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,svelte,spec.ts}`],
    skipFormat: true,
    skipPackageJson: options.skipPackageJson,
  });

  addSvelteEslintConfig(host, options.projectRoot);

  const installTask = addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies,
  );

  return runTasksInSerial(lintTask, installTask);
}
