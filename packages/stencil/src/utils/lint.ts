import {
  ESLINT_PLUGIN_VERSIONS,
  eslintImportPlugin,
  stencilEslintPlugin,
} from './versions';
import {
  logger,
  offsetFromRoot,
  Tree,
  GeneratorCallback,
  workspaceRoot,
} from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { ArrayLiteralExpression, ScriptKind, SyntaxKind } from 'typescript';
import { insertChange, replaceChange } from '@nx/js';
import { EOL } from 'node:os';
import { join } from 'node:path';
import { getTerminalLinkForAbsolutePath } from '@nxext/common';
import { stripIndent } from 'nx/src/utils/logger';

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

export const beginningOfEsLintConfigJsCjs = `const importPlugin = require('eslint-plugin-import');
/**
 * @stencil-community/eslint-plugin may not support the flat config yet
 *
 * TODO: activate @stencil-community/eslint-plugin when it supports the flat config
 *
 * const stencilPlugin = require('@stencil-community/eslint-plugin');
 */
`;

export const beginningOfEsLintConfigJsEsm = `import importPlugin from 'eslint-plugin-import';
/**
 * @stencil-community/eslint-plugin may not support the flat config yet
 *
 * TODO: activate @stencil-community/eslint-plugin when it supports the flat config
 *
 * import stencilPlugin from '@stencil-community/eslint-plugin';
 */
`;

// Kept for backwards compatibility with existing imports/tests; the CJS form
// only fits a module.exports-shaped config (see augmentStencilEslintFlatConfig).
export const beginningOfEsLintConfigJs = beginningOfEsLintConfigJsCjs;

export const augmentStencilEslintFlatConfig = (
  tree: Tree,
  eslintFlatConfigFileContent: string,
  eslintFlatConfigFilePath: string
): GeneratorCallback => {
  let sourceFile = tsquery.ast(
    eslintFlatConfigFileContent,
    eslintFlatConfigFilePath,
    ScriptKind.JS
  );

  const [configArrayNodeBeforeInsert] = tsquery
    .query<ArrayLiteralExpression>(sourceFile, 'ArrayLiteralExpression')
    .filter((configArrayNode: ArrayLiteralExpression) => {
      const ejsExport =
        configArrayNode.parent?.kind === SyntaxKind.ExportAssignment;
      const cjsExport =
        configArrayNode.parent?.kind === SyntaxKind.BinaryExpression &&
        (configArrayNode.parent.getText().startsWith('module.exports =') ||
          configArrayNode.parent.getText().startsWith('exports ='));
      return ejsExport || cjsExport;
    });
  // `eslint.config.mjs` (Nx's current default) is a real ES module — a CJS
  // `require()` there throws at load time. Emit the matching import form
  // instead of always assuming CommonJS.
  const isEsm =
    configArrayNodeBeforeInsert?.parent?.kind === SyntaxKind.ExportAssignment;

  sourceFile = insertChange(
    tree,
    sourceFile,
    eslintFlatConfigFilePath,
    0,
    isEsm ? beginningOfEsLintConfigJsEsm : beginningOfEsLintConfigJsCjs
  );

  const [configArrayNode] = tsquery
    .query<ArrayLiteralExpression>(sourceFile, 'ArrayLiteralExpression')
    .filter((configArrayNode: ArrayLiteralExpression) => {
      const ejsExport =
        configArrayNode.parent?.kind === SyntaxKind.ExportAssignment;
      const cjsExport =
        configArrayNode.parent?.kind === SyntaxKind.BinaryExpression &&
        (configArrayNode.parent.getText().startsWith('module.exports =') ||
          configArrayNode.parent.getText().startsWith('exports ='));
      return ejsExport || cjsExport;
    });

  if (configArrayNode) {
    replaceChange(
      tree,
      sourceFile,
      eslintFlatConfigFilePath,
      configArrayNode.getFullStart(),
      `[
  /**
   * TODO: activate @stencil-community/eslint-plugin when it supports the flat config
   *
   * stencilPlugin.flatConfigs.recommended
   */
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ${configArrayNode.elements
    .map((node) => node.getFullText())
    .join(`,${EOL}  `)},
  {
    ignores: ['!**/*'],
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      /**
       * Stencil's own generated \`src/index.ts\` re-exports \`./components\`,
       * resolved only via the sibling \`components.d.ts\` ambient declaration
       * (a type-only file, valid to tsc) — eslint-plugin-import's default
       * resolver doesn't follow that convention without extra TypeScript
       * resolver config, so it flags a false positive here.
       */
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['*.js', '*.jsx'],
    rules: {},
  },
]`,
      configArrayNode.getFullText()
    );
  }

  return () => {
    logger.warn(
      `@stencil-community/eslint-plugin may not support the flat config yet.`
    );
    logger.warn(`update this file:`);
    logger.warn(
      getTerminalLinkForAbsolutePath(
        join(workspaceRoot, eslintFlatConfigFilePath)
      )
    );
    logger.warn(`once the plugin does support the flat config.`);
  };
};

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
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
});
