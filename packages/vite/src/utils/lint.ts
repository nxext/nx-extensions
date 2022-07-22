import { offsetFromRoot } from '@nrwl/devkit';
import type { Linter } from 'eslint';
import { eslintPluginImportVersion, eslintPluginViteVersion } from './version';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-import': eslintPluginImportVersion,
    'vite-plugin-eslint': eslintPluginViteVersion,
  },
};

export const createViteEslintJson = (
  projectRoot: string,
  setParserOptionsProject: boolean,
  supportedEtx: Array<'tsx' | 'jsx' | 'ts' | 'js'>
): Linter.Config => ({
  extends: [`${offsetFromRoot(projectRoot)}.eslintrc.json`],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: supportedEtx.map((ext) => `*.${ext}`),
      parserOptions: !setParserOptionsProject
        ? undefined
        : {
            project: [`${projectRoot}/tsconfig.*?.json`],
          },
      rules: {},
    },
    {
      files: supportedEtx.map((ext) => `*.${ext}`),
      rules: {},
    },
    {
      files: supportedEtx.map((ext) => `*.${ext}`),
      rules: {},
    },
  ],
});
