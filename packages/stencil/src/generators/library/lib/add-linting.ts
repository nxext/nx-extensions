import {
  addDependenciesToPackageJson,
  ensurePackage,
  GeneratorCallback,
  joinPathFragments,
  NX_VERSION,
  Tree,
  updateJson,
  runTasksInSerial,
} from '@nx/devkit';
import { LibrarySchema } from '../schema';
import { Linter } from '@nx/eslint';
import {
  createStencilEslintJson,
  extraEslintDependencies,
} from '../../../utils/lint';

export async function addLinting(host: Tree, options: LibrarySchema) {
  if (options.linter !== Linter.EsLint) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nx/eslint', NX_VERSION);
  const { lintProjectGenerator } = await import('@nx/eslint');
  const tasks: GeneratorCallback[] = [];
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
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
