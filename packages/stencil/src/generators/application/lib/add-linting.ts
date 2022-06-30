import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nxext/devkit';
import { ApplicationSchema } from '../schema';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import {
  createStencilEslintJson,
  extraEslintDependencies,
} from '../../../utils/lint';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export async function addLinting(host: Tree, options: ApplicationSchema) {
  if (options.linter !== Linter.EsLint) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const tasks: GeneratorCallback[] = [];
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx}`],
    skipFormat: true,
  });
  tasks.push(lintTask);

  const stencilEslintJson = createStencilEslintJson(options.projectRoot);
  updateJson(
    host,
    joinPathFragments(options.projectRoot, '.eslintrc.json'),
    () => stencilEslintJson
  );

  const installTask = await addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
}
