import {
  ESLINT_PLUGIN_VERSIONS,
  eslintImportPlugin,
  stencilEslintPlugin,
} from './versions';
import { offsetFromRoot } from '@nx/devkit';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    [eslintImportPlugin]: ESLINT_PLUGIN_VERSIONS[eslintImportPlugin],
    [stencilEslintPlugin]: ESLINT_PLUGIN_VERSIONS[stencilEslintPlugin],
  },
};

export type EsLintPluginBaseName<R> = R extends `eslint-plugin-${infer U}`
  ? U
  : R extends `${infer U}/eslint-plugin`
  ? U
  : never;

export function getEsLintPluginBaseName<
  R extends keyof typeof ESLINT_PLUGIN_VERSIONS
>(packageName: R): EsLintPluginBaseName<typeof packageName> {
  if (packageName.startsWith('eslint-plugin-')) {
    return packageName.replace('eslint-plugin-', '') as EsLintPluginBaseName<
      typeof packageName
    >;
  } else if (packageName.endsWith('/eslint-plugin')) {
    return packageName.replace('/eslint-plugin', '') as EsLintPluginBaseName<
      typeof packageName
    >;
  }
  throw Error(`[stencil] unsupported eslint plugin name: ${packageName}`);
}

export const createStencilEslintJson = (projectRoot: string) => ({
  extends: [
    `plugin:${getEsLintPluginBaseName(stencilEslintPlugin)}/recommended`,
    `plugin:${getEsLintPluginBaseName(eslintImportPlugin)}/recommended`,
    `plugin:${getEsLintPluginBaseName(eslintImportPlugin)}/typescript`,
    `${offsetFromRoot(projectRoot)}.eslintrc.json`,
  ],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      /**
       * Having an empty rules object present makes it more obvious to the user where they would
       * extend things from if they needed to
       */
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
});
