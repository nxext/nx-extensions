import { logger, Tree } from '@nx/devkit';
import {
  addOverrideToLintConfig,
  addPredefinedConfigToFlatLintConfig,
  useFlatConfig,
} from '@nx/eslint/internal';
import { eslintPluginSvelteVersion } from './versions';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-svelte': eslintPluginSvelteVersion,
  },
};

/**
 * Wires up `eslint-plugin-svelte`'s flat "recommended" config for
 * `projectRoot`, plus a TypeScript-in-`.svelte` parser override so
 * `<script lang="ts">` blocks are understood.
 *
 * `eslint-plugin-svelte` v3 and its `svelte-eslint-parser` dependency are
 * ESM-only packages that ship flat-config exports exclusively. There is no
 * legacy-`.eslintrc`-compatible shareable config to `extends` from any
 * more, so if the workspace's own ESLint config is still in legacy format
 * (ESLint < 9 without `ESLINT_USE_FLAT_CONFIG=true`), wiring the plugin
 * into a legacy config would crash at lint time with `ERR_REQUIRE_ESM`. In
 * that case this is a no-op: `.ts` files keep linting as usual via whatever
 * `lintProjectGenerator` already set up, `.svelte` files are just not
 * covered by Svelte-specific rules until the workspace migrates to flat
 * config.
 */
export function addSvelteEslintConfig(tree: Tree, projectRoot: string): void {
  if (!useFlatConfig(tree)) {
    logger.warn(
      `eslint-plugin-svelte requires a flat ESLint config, so Svelte-specific lint rules were not added for "${projectRoot}" (the workspace is still using a legacy .eslintrc config). Migrate to flat config (or set ESLINT_USE_FLAT_CONFIG=true) to lint .svelte files.`
    );
    return;
  }

  addPredefinedConfigToFlatLintConfig(tree, projectRoot, 'recommended', {
    moduleName: 'svelte',
    moduleImportPath: 'eslint-plugin-svelte',
  });
  addOverrideToLintConfig(tree, projectRoot, {
    files: ['**/*.svelte'],
    // NB: this must be nested under `languageOptions` already (rather than
    // the legacy top-level `parserOptions` shape that `addOverrideToLintConfig`
    // would otherwise translate) because its AST generator special-cases any
    // property literally named `parser` by resolving it through
    // `override.languageOptions?.parserOptions?.parser` - passing the
    // legacy shape leaves that lookup empty and crashes.
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  } as Parameters<typeof addOverrideToLintConfig>[2]);
}
