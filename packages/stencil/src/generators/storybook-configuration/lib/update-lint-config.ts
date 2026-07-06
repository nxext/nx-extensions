import { readProjectConfiguration, Tree, updateJson } from '@nx/devkit';
import {
  addOverrideToLintConfig,
  findEslintFile,
  useFlatConfig,
} from '@nx/eslint/internal';
import { StorybookConfigureSchema } from '../schema';
import { join } from 'path';

/**
 * When adding storybook we need to inform ESLint
 * of the additional tsconfig.json file which will be the only tsconfig
 * which includes *.stories files.
 *
 * For legacy `.eslintrc.json` workspaces this is done by appending to
 * `parserOptions.project`. TS-solution workspaces (as scaffolded by
 * `create-nx-workspace`) default to flat config, which has no equivalent
 * `.eslintrc.json` file to patch at all - use `@nx/eslint/internal`'s flat
 * config helpers instead (mirrors `packages/svelte/src/generators/utils/lint.ts`).
 *
 * Projects with no lint config at all (e.g. `linter: 'none'`, or unit-test
 * fixtures that never ran `addLinting`) get neither branch - matches the
 * pre-existing legacy-only guard's behavior of silently no-op'ing.
 */
export function updateLintConfig(tree: Tree, schema: StorybookConfigureSchema) {
  const { name: projectName } = schema;

  const { root } = readProjectConfiguration(tree, projectName);

  if (!findEslintFile(tree, root)) {
    return;
  }

  if (useFlatConfig(tree)) {
    addOverrideToLintConfig(tree, root, {
      files: ['**/*.stories.ts', '**/*.stories.tsx'],
      languageOptions: {
        parserOptions: {
          project: [join(root, '.storybook/tsconfig.json')],
        },
      },
    } as Parameters<typeof addOverrideToLintConfig>[2]);
    return;
  }

  if (tree.exists(join(root, '.eslintrc.json'))) {
    updateJson(tree, join(root, '.eslintrc.json'), (json) => {
      if (typeof json.parserOptions?.project === 'string') {
        json.parserOptions.project = [json.parserOptions.project];
      }

      if (Array.isArray(json.parserOptions?.project)) {
        json.parserOptions.project = dedupe([
          ...json.parserOptions.project,
          join(root, '.storybook/tsconfig.json'),
        ]);
      }

      const overrides = json.overrides || [];
      for (const o of overrides) {
        if (typeof o.parserOptions?.project === 'string') {
          o.parserOptions.project = [o.parserOptions.project];
        }
        if (Array.isArray(o.parserOptions?.project)) {
          o.parserOptions.project = dedupe([
            ...o.parserOptions.project,
            join(root, '.storybook/tsconfig.json'),
          ]);
        }
      }

      return json;
    });
  }
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr));
}
