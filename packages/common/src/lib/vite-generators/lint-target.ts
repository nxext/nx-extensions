import { joinPathFragments, TargetConfiguration } from '@nx/devkit';

/**
 * Pure Funktion, kein Tree-Zugriff. Ersetzt `create-lint-target.ts`
 * (preact) / das inline `createLintTarget` (solid) / `createLintTarget`
 * aus `utils/targets.ts` (svelte), OHNE `createSvelteCheckTarget` (das
 * bleibt in svelte, siehe Design 1.2).
 */
export function createEslintLintTarget(
  projectRoot: string,
  tsConfigFileName: 'tsconfig.app.json' | 'tsconfig.lib.json'
): TargetConfiguration {
  return {
    executor: '@nx/eslint:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(projectRoot, tsConfigFileName),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(projectRoot, '**/*')}`,
      ],
    },
  };
}
