export const stencilVersion = '^4.43.0';
export const stencilRouterVersion = '^1.0.1';

export const puppeteer = '^21.4.1';
// Stencil's own integrated `test --e2e`/`--spec` task hard-validates that
// these exact majors are installed in the consumer's node_modules,
// independent of whatever `unitTestRunner` (Nx's own jest/vitest target)
// the project was generated with.
export const stencilTestJestVersion = '^29.0.0';
export const stencilTestJestCliVersion = '^29.0.0';
export const stencilTestTypesJestVersion = '^29.0.0';
export const typesNodeVersion = '^22.0.0';

export const deprecatedStencilEslintPlugin = '@stencil/eslint-plugin';
export const stencilEslintPlugin = '@stencil-community/eslint-plugin';
export const eslintImportPlugin = 'eslint-plugin-import';
export const ESLINT_PLUGIN_VERSIONS = {
  [deprecatedStencilEslintPlugin]: '0.3.1',
  [stencilEslintPlugin]: '^0.8.0',
  [eslintImportPlugin]: '^2.28.0',
};

export const STENCIL_OUTPUTTARGET_VERSION = {
  react: '^0.5.3',
  angular: '^0.8.3',
  vue: '^0.9.0',
};

export const STENCIL_STYLE_PLUGIN_VERSION = {
  scss: '3.0.7',
};
