import {
  addDependenciesToPackageJson,
  ensurePackage,
  GeneratorCallback,
  joinPathFragments,
  NX_VERSION,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { FrameworkDependencyMap } from './types';

/**
 * Deckt NUR den App-Fall von preact/solid ab (Design 1.2 "(b)" für
 * Application). svelte ruft diese Funktion NICHT auf (kein Guard, anderer
 * Import-Stil, `unitTestRunner`-Option, `addSvelteEslintConfig` statt
 * rename/delete) — svelte bleibt bei seiner eigenen `add-linting.ts`. Die
 * Library-Variante wird NICHT extrahiert (drei echte Implementierungen,
 * siehe Design 1.2 "(c)").
 */
export async function addEslintLintProject(
  host: Tree,
  options: {
    linter: LinterType;
    projectName: string;
    projectRoot: string;
    tsConfigFileName: 'tsconfig.app.json';
  },
  extraDependencies: FrameworkDependencyMap
): Promise<GeneratorCallback> {
  if (options.linter !== 'eslint') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const { lintProjectGenerator } = ensurePackage<typeof import('@nx/eslint')>(
    '@nx/eslint',
    NX_VERSION
  );

  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, options.tsConfigFileName),
    ],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,spec.ts,tsx}`],
    skipFormat: true,
  });

  host.rename(
    joinPathFragments(options.projectRoot, 'eslintrc.js'),
    joinPathFragments(options.projectRoot, '.eslintrc.js')
  );
  host.delete(joinPathFragments(options.projectRoot, '.eslintrc.json'));

  const installTask = await addDependenciesToPackageJson(
    host,
    extraDependencies.dependencies,
    extraDependencies.devDependencies
  );

  return runTasksInSerial(lintTask, installTask);
}
