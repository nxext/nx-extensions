import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  runTasksInSerial,
  ensurePackage,
  NX_VERSION,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { extraEslintDependencies } from '../../utils/lint';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter !== 'eslint') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
  const { lintProjectGenerator } = ensurePackage<typeof import('@nx/linter')>(
    '@nx/linter',
    NX_VERSION
  );

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.appProjectRoot}/**/*.{ts,spec.ts,tsx}`],
    skipFormat: true,
  });

  host.rename(
    joinPathFragments(options.appProjectRoot, 'eslintrc.js'),
    joinPathFragments(options.appProjectRoot, '.eslintrc.js')
  );
  host.delete(joinPathFragments(options.appProjectRoot, '.eslintrc.json'));

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
