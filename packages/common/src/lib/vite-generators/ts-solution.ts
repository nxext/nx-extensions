import {
  addProjectConfiguration,
  joinPathFragments,
  readNxJson,
  Tree,
  writeJson,
} from '@nx/devkit';
import {
  addProjectToTsSolutionWorkspace,
  isUsingTsSolutionSetup,
  updateTsconfigFiles,
} from '@nx/js/internal';
import { addTsConfigPath } from '@nx/js';

/**
 * Re-Export statt Neuimplementierung (Design 3.1) — Konsumenten (Plugins UND
 * ihre Specs) importieren `isUsingTsSolutionSetup` NUR von hier, nie direkt
 * von `@nx/js/internal`. Das hält den Absicherungspunkt zentral, falls sich
 * der `@nx/js/internal`-Exportpfad zwischen Nx-Majors ändert (siehe Design
 * Abschnitt 1.1/1.8).
 */
export { isUsingTsSolutionSetup } from '@nx/js/internal';

/**
 * Einzige Lücke aus dem `/internal`-Audit (Design 1.8): `isUsingTypeScriptPlugin`
 * wird von `@nx/js` selbst nirgends exportiert (weder Haupt-Entry noch
 * `/internal`). Nachbau 1:1 nach `ts-solution-setup.js` (kompiliert):
 *
 * ```js
 * function isUsingTypeScriptPlugin(tree) {
 *   const nxJson = readNxJson(tree);
 *   return nxJson?.plugins?.some((p) =>
 *     typeof p === 'string' ? p === '@nx/js/typescript' : p.plugin === '@nx/js/typescript'
 *   ) ?? false;
 * }
 * ```
 */
export function isUsingTypeScriptPlugin(tree: Tree): boolean {
  const nxJson = readNxJson(tree);
  return (
    nxJson?.plugins?.some((p) =>
      typeof p === 'string'
        ? p === '@nx/js/typescript'
        : p.plugin === '@nx/js/typescript',
    ) ?? false
  );
}

/**
 * Kapselt Design 1.2 (Registrierung in `pnpm-workspace.yaml`/`package.json.workspaces`)
 * + 1.3 (Project References/Runtime-Tsconfig) hinter einem Aufruf, analog zu
 * dem, was `@nx/react`/`@nx/js` an mehreren Stellen inline wiederholen (siehe
 * z.B. react `application.js:104-106` + `:154-160`). Gedacht als EIN Aufruf
 * pro App-/Lib-Generator, direkt nach der Projekt-Registrierung.
 *
 * `updateTsconfigFiles` guardet sich bereits selbst gegen den Legacy-Mode
 * (`ts-solution-setup.js`: `if (!isUsingTsSolutionSetup(tree)) return;`).
 * `addProjectToTsSolutionWorkspace` tut das NICHT (schreibt unconditional in
 * `pnpm-workspace.yaml`/`package.json.workspaces`) — deshalb wird hier extra
 * gegen `isUsingTsSolutionSetup(tree)` gegated, damit der gesamte Aufruf im
 * Legacy-Mode ein reines No-op ist, wie im Design (3.1) beschrieben.
 */
export async function wireTsSolutionProject(
  tree: Tree,
  projectRoot: string,
  runtimeTsconfigFileName: 'tsconfig.app.json' | 'tsconfig.lib.json',
  compilerOptions: Record<string, string | boolean | string[]>,
  opts?: { exclude?: string[]; rootDir?: string },
): Promise<void> {
  if (!isUsingTsSolutionSetup(tree)) {
    return;
  }

  await addProjectToTsSolutionWorkspace(tree, projectRoot);
  updateTsconfigFiles(
    tree,
    projectRoot,
    runtimeTsconfigFileName,
    compilerOptions,
    opts?.exclude,
    opts?.rootDir,
  );
}

/**
 * Deckt Design 1.4 (package.json-Form) ab. 1:1 nachgebildet nach
 * `@nx/react`s `library.js` (Zeilen ~58-84 in der kompilierten Fassung):
 *
 * ```js
 * const packageJson = { name: options.importPath, version: '0.0.1', ... };
 * if (!options.useProjectJson) {
 *   if (options.name !== options.importPath) packageJson.nx = { name: options.name };
 *   if (options.parsedTags?.length) { packageJson.nx ??= {}; packageJson.nx.tags = options.parsedTags; }
 * } else {
 *   addProjectConfiguration(host, options.name, { root, sourceRoot, projectType, tags, targets: {} });
 * }
 * if (!options.useProjectJson || options.isUsingTsSolutionConfig) {
 *   writeJson(host, `${options.projectRoot}/package.json`, packageJson);
 * }
 * ```
 *
 * Abweichung von der Design-Skizze (3.1): dort fehlten `projectName`,
 * `projectType` und `parsedTags` im Options-Interface, obwohl das
 * Nx-Original genau diese Felder braucht, um `nx.name`/`nx.tags` zu
 * bestimmen bzw. `addProjectConfiguration` aufzurufen. Ohne sie ließe sich
 * das Verhalten nicht nachbilden — deshalb hier ergänzt (siehe Bericht).
 */
export interface ProjectPackageJsonOptions {
  projectName: string;
  projectRoot: string;
  importPath: string;
  isUsingTsSolutionConfig: boolean;
  /** Default (Aufrufer-Verantwortung, analog react `normalize-options.js:48`): `!isUsingTsSolutionConfig`. */
  useProjectJson: boolean;
  /** Nur relevant, wenn `useProjectJson === true` (Argument für `addProjectConfiguration`). */
  projectType: 'application' | 'library';
  parsedTags?: string[];
  version?: string;
  /** z.B. `'./src/index.ts'` im TS-Solution-Fall (kein Build-Output). */
  main?: string;
  exports?: Record<string, unknown>;
  files?: string[];
}

export function addProjectPackageJson(
  tree: Tree,
  opts: ProjectPackageJsonOptions,
): void {
  const packageJson: Record<string, unknown> = {
    name: opts.importPath,
    version: opts.version ?? '0.0.1',
  };
  if (opts.main !== undefined) {
    packageJson.main = opts.main;
  }
  if (opts.exports !== undefined) {
    packageJson.exports = opts.exports;
  }
  if (opts.files !== undefined) {
    packageJson.files = opts.files;
  }

  if (!opts.useProjectJson) {
    if (opts.projectName !== opts.importPath) {
      packageJson.nx = { name: opts.projectName };
    }
    if (opts.parsedTags?.length) {
      packageJson.nx ??= {};
      (packageJson.nx as Record<string, unknown>).tags = opts.parsedTags;
    }
  } else {
    addProjectConfiguration(tree, opts.projectName, {
      root: opts.projectRoot,
      sourceRoot: joinPathFragments(opts.projectRoot, 'src'),
      projectType: opts.projectType,
      tags: opts.parsedTags,
      targets: {},
    });
  }

  if (!opts.useProjectJson || opts.isUsingTsSolutionConfig) {
    writeJson(tree, `${opts.projectRoot}/package.json`, packageJson);
  }
}

/**
 * Deckt Design 1.6 ab: `addTsConfigPath` (Haupt-Entry `@nx/js`) schreibt
 * `compilerOptions.paths[importPath]` in `tsconfig.base.json` — das
 * passiert NUR im Legacy-Mode. In TS-Solution-Workspaces übernehmen
 * Package-Manager-Workspace-Symlinks + Project References (siehe
 * `wireTsSolutionProject`) die Cross-Projekt-Auflösung; `tsconfig.base.json`
 * wird dort nie wieder von `addTsConfigPath` berührt (react `library.js`
 * bzw. js `library.js` guarden identisch:
 * `if (!options.skipTsConfig && !options.isUsingTsSolutionConfig) addTsConfigPath(...)`).
 *
 * Dieser Wrapper übernimmt exakt den `isUsingTsSolutionConfig`-Teil dieses
 * Guards; ein etwaiges `skipTsConfig` bleibt Sache des Aufrufers (Plugins
 * rufen diese Funktion dann schlicht nicht auf).
 */
export function maybeAddTsConfigPath(
  tree: Tree,
  importPath: string,
  lookupPaths: string[],
  isUsingTsSolutionConfig: boolean,
): void {
  if (isUsingTsSolutionConfig) {
    return;
  }
  addTsConfigPath(tree, importPath, lookupPaths);
}
