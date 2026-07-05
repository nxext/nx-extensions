import { readNxJson, Tree } from '@nx/devkit';
import {
  determineProjectNameAndRootOptions,
  ensureRootProjectName,
} from '@nx/devkit/internal';
import { isUsingTsSolutionSetup } from './ts-solution';

/**
 * Deckt NUR den Teil ab, der im Design-Dokument als (b) parametrisierbar
 * klassifiziert wurde: projectRoot/projectName-Auflösung via
 * `determineProjectNameAndRootOptions`, `parsedTags`, sowie die
 * e2e-Feld-Ableitung aus `nxJson.targetDefaults`. `fileName` und die Frage,
 * ob `name` case-normalisiert wird, bleiben bewusst außen vor (echte
 * Verhaltensdivergenz zwischen preact/solid/svelte, siehe Design Abschnitt
 * 0/1.1).
 */
export interface NormalizeViteAppCoreOptions {
  name?: string;
  /**
   * Required, nicht optional — `ensureRootProjectName` (@nx/devkit/internal)
   * verlangt `directory: string`, und alle drei realen Schema-Typen
   * (PreactApplicationSchema/Schema) deklarieren `directory` bereits als
   * required (Abweichung von der optionalen Signatur im Design-Dokument,
   * siehe Bericht).
   */
  directory: string;
  tags?: string;
  /** preact setzt dieses Feld nie -> bleibt `undefined`. */
  rootProject?: boolean;
}

export interface ViteAppCoreFields {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  /**
   * Additiv (Design 3.1/3.3): `determineProjectNameAndRootOptions` liefert
   * `importPath` unabhängig von `projectType` (verifiziert gegen
   * `@nx/devkit`s `project-name-and-root-utils.js` — auch Applications
   * bekommen einen `importPath`, siehe react
   * `application/lib/normalize-options.js`). Bestehende Aufrufer, die dieses
   * Feld ignorieren, sind unberührt.
   */
  importPath: string;
  /**
   * Additiv (Design 1.1/3.1): einmal berechnet, analog zu Nx' eigenem
   * `options.isUsingTsSolutionConfig`-Muster. Bestehende Aufrufer (svelte,
   * solid, preact), die dieses Feld noch nicht auswerten, verhalten sich
   * unverändert (Rückgabewert ist rein additiv).
   */
  isUsingTsSolutionConfig: boolean;
}

export async function normalizeViteAppCore(
  tree: Tree,
  options: NormalizeViteAppCoreOptions,
  // Design-Dokument beschreibt dies als `string`; `ensureRootProjectName`
  // (@nx/devkit/internal) akzeptiert aber nur diese literale Union — enger
  // typisiert, damit der Aufruf ohne Cast durchkompiliert (siehe Bericht).
  generatorName: 'application' | 'library',
): Promise<ViteAppCoreFields> {
  await ensureRootProjectName(options, generatorName);
  const {
    projectName: resolvedProjectName,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: 'application',
    directory: options.directory,
    rootProject: options.rootProject,
  });

  const isRootProject = projectRoot === '.';
  const isUsingTsSolutionConfig = isUsingTsSolutionSetup(tree);
  // Design 1.5, 1:1 nach react `application/lib/normalize-options.js:22-23`:
  // ohne explizites `--name` wird der Nx-Projektname in TS-Solution-Mode auf
  // den vollen `importPath` gesetzt statt auf den bloßen Verzeichnisnamen.
  // Im Legacy-Fall (`isUsingTsSolutionConfig === false`) ist dieser Ausdruck
  // immer `resolvedProjectName` — bestehendes Verhalten bleibt unverändert.
  const projectName =
    !isUsingTsSolutionConfig || options.name ? resolvedProjectName : importPath;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const nxJson = readNxJson(tree);

  const e2eWebServerTarget = 'serve';
  let e2ePort = 4200;
  if (
    nxJson.targetDefaults?.[e2eWebServerTarget] &&
    nxJson.targetDefaults?.[e2eWebServerTarget].options?.port
  ) {
    e2ePort = nxJson.targetDefaults?.[e2eWebServerTarget].options?.port;
  }

  const e2eProjectName = isRootProject ? 'e2e' : `${projectName}-e2e`;
  const e2eProjectRoot = isRootProject ? 'e2e' : `${projectRoot}-e2e`;
  const e2eWebServerAddress = `http://localhost:${e2ePort}`;

  return {
    projectName,
    projectRoot,
    parsedTags,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    importPath,
    isUsingTsSolutionConfig,
  };
}

export interface NormalizeViteLibCoreOptions {
  name?: string;
  /** Required — siehe Begründung bei `NormalizeViteAppCoreOptions`. */
  directory: string;
  tags?: string;
  importPath?: string;
}

export interface ViteLibCoreFields {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  importPath: string;
  /** Additiv — siehe Begründung bei `ViteAppCoreFields.isUsingTsSolutionConfig`. */
  isUsingTsSolutionConfig: boolean;
}

export async function normalizeViteLibCore(
  tree: Tree,
  options: NormalizeViteLibCoreOptions,
): Promise<ViteLibCoreFields> {
  await ensureRootProjectName(options, 'library');
  const {
    projectName: resolvedProjectName,
    projectRoot,
    importPath,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: 'library',
    directory: options.directory,
    importPath: options.importPath,
    rootProject: false,
  });

  const isUsingTsSolutionConfig = isUsingTsSolutionSetup(tree);
  // Design 1.5, 1:1 nach react `library/lib/normalize-options.js`:
  // `name: isUsingTsSolutionConfig && !options.name ? importPath : projectName`.
  // Im Legacy-Fall bleibt das Ergebnis `resolvedProjectName` — unverändert.
  const projectName =
    isUsingTsSolutionConfig && !options.name ? importPath : resolvedProjectName;

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    projectName,
    projectRoot,
    isUsingTsSolutionConfig,
    parsedTags,
    importPath,
  };
}
