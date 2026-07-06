import { names, Tree } from '@nx/devkit';
import { normalizeViteAppCore } from '@nxext/common';
import { NormalizedSchema, Schema } from '../schema';

/**
 * Kernanteil (projectName/projectRoot-Auflösung via
 * `determineProjectNameAndRootOptions`, `parsedTags`, e2e-Feld-Ableitung aus
 * `nxJson.targetDefaults`) kommt aus `@nxext/common`'s `normalizeViteAppCore`
 * (identisch zu preact/solid). svelte-Eigenheiten bleiben bewusst lokal:
 * `fileName` ist hier immer hartkodiert `'App'` (svelte meint damit die
 * Hauptkomponente, nicht den Projektnamen), `name` wird zusätzlich über
 * `names(...).fileName` case-normalisiert, und `rootProject` wird - wie
 * bisher - aus dem aufgelösten `projectRoot` zurück auf die Options
 * geschrieben (relevant für nachgelagerte Aufrufer wie `addCypressApplication`).
 */
export async function normalizeOptions(
  host: Tree,
  options: Schema,
): Promise<NormalizedSchema> {
  const {
    projectName,
    projectRoot,
    parsedTags,
    e2eProjectName,
    e2eProjectRoot,
    e2eWebServerAddress,
    e2eWebServerTarget,
    importPath,
    isUsingTsSolutionConfig,
  } = await normalizeViteAppCore(host, options, 'application');

  options.name ??= projectName;
  options.rootProject = projectRoot === '.';

  const fileName = 'App';

  return {
    ...options,
    name: names(options.name).fileName,
    projectName,
    projectRoot,
    e2eProjectName,
    e2eProjectRoot,
    parsedTags,
    fileName,
    e2eWebServerAddress,
    e2eWebServerTarget,
    skipFormat: false,
    importPath,
    isUsingTsSolutionConfig,
    // Nx pattern (react/vue `normalize-options.js`): default is the exact
    // negation of the TS-solution flag. Not exposed as a user-facing CLI
    // option here - see report for the scope rationale.
    useProjectJson: !isUsingTsSolutionConfig,
  };
}
