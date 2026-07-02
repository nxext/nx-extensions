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
import { ApplicationSchema } from '../schema';
import { Linter } from '@nx/eslint';
import {
  augmentStencilEslintFlatConfig,
  createStencilEslintJson,
  extraEslintDependencies,
} from '../../../utils/lint';
import { findEslintFile } from '@nx/eslint/internal';
import { useFlatConfig } from '@nx/eslint/internal';

export async function addLinting(host: Tree, options: ApplicationSchema) {
  if (options.linter === Linter.EsLint) {
    await ensurePackage('@nx/eslint', NX_VERSION);
    const { lintProjectGenerator } = await import('@nx/eslint');

    const tasks: GeneratorCallback[] = [];

    tasks.push(
      await lintProjectGenerator(host, {
        linter: options.linter,
        project: options.projectName,
        tsConfigPaths: [
          joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
        ],
        eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx}`],
        unitTestRunner: options.unitTestRunner,
        skipFormat: true,
        setParserOptionsProject: void 0, // this sets the default value,
        addPlugin: void 0, // this sets the default value,
      })
    );

    const eslintFile = findEslintFile(host, options.projectRoot);
    let eslintFlatConfigTask: GeneratorCallback = () => {};
    if (useFlatConfig(host)) {
      const eslintFlatConfigFilePath = joinPathFragments(
        options.projectRoot,
        eslintFile
      );
      let eslintFlatConfigFileContent = host.read(
        eslintFlatConfigFilePath,
        'utf8'
      );
      eslintFlatConfigTask = augmentStencilEslintFlatConfig(
        host,
        eslintFlatConfigFileContent,
        eslintFlatConfigFilePath
      );
    } else {
      const stencilEslintJson = createStencilEslintJson(options.projectRoot);
      updateJson(
        host,
        joinPathFragments(options.projectRoot, eslintFile),
        () => stencilEslintJson
      );
    }

    const installTask = addDependenciesToPackageJson(
      host,
      extraEslintDependencies.dependencies,
      extraEslintDependencies.devDependencies
    );
    tasks.push(installTask);

    return runTasksInSerial(...tasks, eslintFlatConfigTask);
  }
  return () => {};
}
