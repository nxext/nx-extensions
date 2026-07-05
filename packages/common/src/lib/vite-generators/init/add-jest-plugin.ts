import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

/**
 * Grundmuster (Guard + `ensurePackage` + `jestInitGenerator(tree, {})`),
 * das preact/solid/svelte alle teilen. Der Guard bleibt bewusst ein
 * Parameter (Function), damit jeder Aufrufer sein heutiges Prädikat 1:1
 * weiterverwendet — inkl. des in Design-Abschnitt 0 dokumentierten,
 * mutmaßlich invertierten svelte-Prädikats. Dieser Kern "fixt" nichts.
 */
export async function addJestInitPlugin(
  tree: Tree,
  shouldRun: () => boolean
): Promise<GeneratorCallback> {
  if (!shouldRun()) {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { jestInitGenerator } = ensurePackage<typeof import('@nx/jest')>(
    '@nx/jest',
    NX_VERSION
  );

  return await jestInitGenerator(tree, {});
}
