import {
  extendNextEslintJson,
  extraEslintDependencies,
} from '../../utils/lint';
import { NormalizedSchema } from '../schema';
import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  joinPathFragments,
  Tree,
  updateJson,
  runTasksInSerial,
  ensurePackage,
  NX_VERSION,
} from '@nx/devkit';
import { mapLintPattern } from '@nxext/common';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  const tasks: GeneratorCallback[] = [];
  if (options.linter === 'eslint') {
    ensurePackage('@nx/eslint', NX_VERSION);
    const { lintProjectGenerator } = await import('@nx/eslint');
    const lintTask = await lintProjectGenerator(host, {
      linter: options.linter,
      project: options.appProjectName,
      tsConfigPaths: [
        joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
      ],
      unitTestRunner: options.unitTestRunner,
      eslintFilePatterns: [
        mapLintPattern(
          options.appProjectRoot,
          '{ts,tsx,js,jsx,vue}',
          options.rootProject
        ),
      ],
      skipFormat: true,
      rootProject: options.rootProject,
    });
    tasks.push(lintTask);

    updateJson(
      host,
      joinPathFragments(options.appProjectRoot, '.eslintrc.json'),
      extendNextEslintJson
    );

    const installTask = await addDependenciesToPackageJson(
      host,
      extraEslintDependencies.dependencies,
      {
        ...extraEslintDependencies.devDependencies,
      }
    );
    tasks.push(installTask);
  }
  return runTasksInSerial(...tasks);
}
