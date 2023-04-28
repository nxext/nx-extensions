import { extendVueEslintJson, extraEslintDependencies } from '../../utils/lint';
import { NormalizedSchema } from '../schema';
import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  joinPathFragments,
  Tree,
  updateJson,
  runTasksInSerial,
} from '@nx/devkit';
import { mapLintPattern } from '@nx/linter/src/generators/lint-project/lint-project';
import { Linter, lintProjectGenerator } from '@nx/linter';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  const tasks: GeneratorCallback[] = [];
  if (options.linter === Linter.EsLint) {
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
          '{ts,tsx,js,jsx}',
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
      extendVueEslintJson
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
