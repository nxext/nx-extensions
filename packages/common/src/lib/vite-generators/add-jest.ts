import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

/**
 * Identisch für App und Lib in allen drei Paketen (siehe Design 1.2 "(b)").
 * preact/solid nutzen bereits das lazy `ensurePackage`-Pattern; svelte
 * importiert `@nx/jest` heute statisch — das ist ein reines
 * Implementierungsdetail (kein Verhaltensunterschied), daher hier
 * einheitlich lazy.
 */
export async function addJestConfiguration(
  host: Tree,
  options: {
    projectName: string;
    unitTestRunner: 'vitest' | 'jest' | 'none';
  }
): Promise<GeneratorCallback> {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { configurationGenerator } = ensurePackage<typeof import('@nx/jest')>(
    '@nx/jest',
    NX_VERSION
  );

  return await configurationGenerator(host, {
    project: options.projectName,
    supportTsx: false,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: false,
  });
}
