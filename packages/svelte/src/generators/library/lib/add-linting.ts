import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  runTasksInSerial,
  ensurePackage,
  NX_VERSION,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import {
  addSvelteEslintConfig,
  extraEslintDependencies,
} from '../../utils/lint';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  const { lintProjectGenerator } = ensurePackage<typeof import('@nx/eslint')>(
    '@nx/eslint',
    NX_VERSION,
  );
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,svelte,spec.ts}`],
    skipFormat: true,
  });

  addSvelteEslintConfig(host, options.projectRoot);

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies,
  );

  return runTasksInSerial(lintTask, installTask);
}
