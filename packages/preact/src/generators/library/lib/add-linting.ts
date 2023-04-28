import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  ensurePackage,
  runTasksInSerial,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { extraEslintDependencies } from '../../utils/lint';
import { readNxVersion } from '../../init/lib/util';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  await ensurePackage(host, '@nx/linter', readNxVersion(host));
  const { lintProjectGenerator } = await import('@nx/linter');

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,spec.ts}`],
    skipFormat: true,
  });

  host.rename(
    joinPathFragments(options.projectRoot, 'eslintrc.js'),
    joinPathFragments(options.projectRoot, '.eslintrc.js')
  );
  host.delete(joinPathFragments(options.projectRoot, '.eslintrc.json'));

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
