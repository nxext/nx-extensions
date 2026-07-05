import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';
import { ViteFrameworkConfig } from './types';

/**
 * 1:1 aus der App-Variante von preact/solid (siehe Design-Dokument 1.2
 * "(a) IDENTISCH"). Die Library-Variante wird bewusst NICHT extrahiert
 * (drei echte Implementierungen, siehe Design 1.1/1.2).
 */
export async function addViteApplication(
  host: Tree,
  options: { projectName: string; unitTestRunner: string }
): Promise<GeneratorCallback> {
  const { viteConfigurationGenerator } = ensurePackage<
    typeof import('@nx/vite')
  >('@nx/vite', NX_VERSION);

  return await viteConfigurationGenerator(host, {
    uiFramework: 'none',
    project: options.projectName,
    newProject: true,
    includeVitest: options.unitTestRunner === 'vitest',
    inSourceTests: false,
  });
}

/**
 * Ersetzt den `createOrEditViteConfig(host, {...}, false)`-Aufruf, der in
 * `application.ts` UND `library.ts` aller drei Pakete identisch aufgerufen
 * wird, nur mit anderem Import-/Call-Ausdruck für das framework-eigene
 * Vite-Plugin (und, nur bei svelte, einem bedingten Zusatz-Plugin für
 * `svelteTesting()`).
 *
 * Lädt `@nx/vite` lazy über `ensurePackage`, damit `@nxext/common` für
 * Plugins ohne Vite-Bezug (capacitor, stencil, ionic-*) weiterhin
 * lastenfrei bleibt (siehe Design 2.5).
 */
export function configureViteFrameworkPlugin(
  host: Tree,
  options: {
    project: string;
    includeLib: boolean;
    includeVitest: boolean;
  },
  frameworkConfig: ViteFrameworkConfig
): void {
  const { createOrEditViteConfig } = ensurePackage<typeof import('@nx/vite')>(
    '@nx/vite',
    NX_VERSION
  );

  const activeExtras = (frameworkConfig.extraPlugins ?? []).filter((extra) =>
    extra.when({ includeVitest: options.includeVitest })
  );

  createOrEditViteConfig(
    host,
    {
      project: options.project,
      includeLib: options.includeLib,
      includeVitest: options.includeVitest,
      inSourceTests: false,
      rolldownOptionsExternal: [],
      imports: [
        frameworkConfig.plugin.importStatement,
        ...activeExtras.map((extra) => extra.importStatement),
      ],
      plugins: [
        frameworkConfig.plugin.pluginCallExpression,
        ...activeExtras.map((extra) => extra.pluginCallExpression),
      ],
    },
    false
  );
}
