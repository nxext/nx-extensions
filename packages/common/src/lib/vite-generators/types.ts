import type { LinterType } from '@nx/eslint';

/**
 * Kleinster gemeinsamer Nenner der drei `NormalizedSchema`-Typen der
 * Vite-basierten Application/Library-Generatoren (preact/solid/svelte).
 *
 * Absichtlich KEIN `fileName` — svelte hartkodiert `'App'`, preact/solid
 * leiten den Wert aus dem Projektnamen ab. Das ist eine echte inhaltliche
 * Divergenz (siehe Design-Dokument Abschnitt 0/1.1) und bleibt daher
 * Sache jedes Aufrufers.
 */
export interface MinimalNormalizedViteSchema {
  projectRoot: string;
  parsedTags: string[];
  unitTestRunner: 'vitest' | 'jest' | 'none';
  linter: LinterType;
  skipFormat?: boolean;
}

/**
 * Zusatzfelder, die nur die Application-Generatoren brauchen (addCypress,
 * e2e-Ermittlung). preact liefert `rootProject` nie (das Schema hat das
 * Feld nicht) -> optional; `undefined` reproduziert preacts heutiges
 * Verhalten (immer "non-root"-Pfade).
 */
export interface MinimalNormalizedViteAppSchema
  extends MinimalNormalizedViteSchema {
  projectName: string;
  e2eTestRunner: 'cypress' | 'none';
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  rootProject?: boolean;
}

export interface MinimalNormalizedViteLibSchema
  extends MinimalNormalizedViteSchema {
  buildable?: boolean;
  publishable?: boolean;
  importPath?: string;
}

/**
 * Beschreibt, wie das framework-eigene Vite-Plugin in die generierte
 * `vite.config.ts` eingebaut wird (Parameter von `createOrEditViteConfig`).
 */
export interface ViteFrameworkPluginSpec {
  /** z. B. `import preact from '@preact/preset-vite'` */
  importStatement: string;
  /** Call-Ausdruck, wie er im `plugins: [...]`-Array landet, z. B. `preact()` */
  pluginCallExpression: string;
}

/**
 * Optionaler zweiter/dritter Plugin-Eintrag, der nur unter einer Bedingung
 * dazukommt (z. B. svelte's `svelteTesting()` nur wenn `includeVitest`).
 */
export interface ConditionalViteExtra {
  when: (ctx: { includeVitest: boolean }) => boolean;
  importStatement: string;
  pluginCallExpression: string;
}

export interface ViteFrameworkConfig {
  /** 'preact' | 'solid' | 'svelte' - nur für Logging/Fehlermeldungen */
  frameworkName: string;
  plugin: ViteFrameworkPluginSpec;
  /** svelte: [svelteTesting-Eintrag] */
  extraPlugins?: ConditionalViteExtra[];
}

/** Shape von preact/solid/svelte `utils/lint.ts::extraEslintDependencies` */
export interface FrameworkDependencyMap {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
