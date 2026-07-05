import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

/**
 * Grundmuster (Guard + `ensurePackage` + `cypressInitGenerator(tree, {})`),
 * das preact/solid/svelte alle teilen. Der Guard bleibt bewusst ein
 * Parameter (Function), damit jeder Aufrufer sein heutiges Prädikat 1:1
 * weiterverwendet — inkl. des in Design-Abschnitt 0 dokumentierten,
 * mutmaßlich falschen svelte-Prädikats (gated auf `unitTestRunner` statt
 * `e2eTestRunner`). Dieser Kern "fixt" nichts.
 */
export async function addCypressInitPlugin(
  tree: Tree,
  shouldRun: () => boolean
): Promise<GeneratorCallback> {
  if (!shouldRun()) {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { cypressInitGenerator } = ensurePackage<typeof import('@nx/cypress')>(
    '@nx/cypress',
    NX_VERSION
  );

  return await cypressInitGenerator(tree, {});
}
