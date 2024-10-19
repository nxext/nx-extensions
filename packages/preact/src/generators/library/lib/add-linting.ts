import {
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
  ensurePackage,
  runTasksInSerial,
  NX_VERSION,
  updateJson,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { extraEslintDependencies } from '../../utils/lint';
import { useFlatConfig } from '@nx/eslint/src/utils/flat-config';
import { findEslintFile } from '@nx/eslint/src/generators/utils/eslint-file';

export async function addLinting(host: Tree, options: NormalizedSchema) {
  if (options.linter !== 'eslint') {
    return () => {
      /* empty */
    };
  }

  const { lintProjectGenerator } = ensurePackage<typeof import('@nx/eslint')>(
    '@nx/eslint',
    NX_VERSION
  );

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.name,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,spec.ts}`],
    skipFormat: true,
  });

  const eslintFile = findEslintFile(host, options.projectRoot);
  const eslintFilePath = joinPathFragments(options.projectRoot, eslintFile);
  if (useFlatConfig(host)) {
    /**
     * TODO: augment flat config once the plugins are ready with the flat
     */
  } else {
    updateJson(host, eslintFilePath, (json) => {
      const overrides = [
        {
          files: ['*.ts', '*.js', '*.tsx'],
          parserOptions: {
            project: [
              `${joinPathFragments(options.projectRoot, 'tsconfig.*?.json')}`,
            ],
          },
          rules: {},
        },
        ...(json.overrides ?? []),
      ];
      const ignorePatterns = [
        ...(json.ignorePatterns ?? ['!**/*']),
        'vite.config.ts',
      ];
      const plugins = [...(json.plugins ?? []), 'preact', '@typescript-eslint'];
      const extendsVal = [...(json.extends ?? [])];
      delete json.plugins;
      delete json.ignorePatterns;
      delete json.overrides;
      delete json.extends;
      return {
        extends: extendsVal,
        parser: '@typescript-eslint/parser',
        plugins,
        ignorePatterns,
        overrides,
        ...json,
      };
    });
  }

  const installTask = addDependenciesToPackageJson(
    host,
    extraEslintDependencies.dependencies,
    extraEslintDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
