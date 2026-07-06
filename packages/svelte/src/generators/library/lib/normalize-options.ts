import { Tree } from '@nx/devkit';
import { normalizeViteLibCore } from '@nxext/common';
import { NormalizedSchema, SvelteLibrarySchema } from '../schema';

/**
 * Kernanteil (projectName/projectRoot/importPath-Auflösung via
 * `determineProjectNameAndRootOptions`, `parsedTags`) kommt aus
 * `@nxext/common`'s `normalizeViteLibCore` (identisch zu preact/solid).
 *
 * `fileName` bleibt svelte-eigen: `determineProjectNameAndRootOptions`
 * liefert intern zusätzlich `names.projectFileName`/`projectSimpleName`
 * (Scope-Split bei `@scope/name`-Importpfaden), die `normalizeViteLibCore`
 * nicht mit exportiert (siehe `ViteLibCoreFields` in `@nxext/common`). Beide
 * Werte werden ausschließlich aus `projectName` (== `name` innerhalb von
 * `determineProjectNameAndRootOptions`) abgeleitet, daher wird die Ableitung
 * hier 1:1 nachgebildet statt die Funktion ein zweites Mal aufzurufen.
 */
function deriveProjectFileNames(projectName: string): {
  projectFileName: string;
  projectSimpleName: string;
} {
  if (projectName.startsWith('@')) {
    const [, ...rest] = projectName.split('/');
    return {
      projectFileName: rest.join('-'),
      projectSimpleName: rest[rest.length - 1],
    };
  }
  return { projectFileName: projectName, projectSimpleName: projectName };
}

export async function normalizeOptions(
  host: Tree,
  options: SvelteLibrarySchema,
): Promise<NormalizedSchema> {
  const {
    projectName,
    projectRoot,
    parsedTags,
    importPath,
    isUsingTsSolutionConfig,
  } = await normalizeViteLibCore(host, options);

  const { projectFileName, projectSimpleName } =
    deriveProjectFileNames(projectName);
  const fileName = options.simpleName ? projectSimpleName : projectFileName;

  return {
    ...options,
    name: projectName,
    projectRoot,
    parsedTags,
    fileName,
    projectDirectory: projectRoot,
    importPath,
    isUsingTsSolutionConfig,
    // Nx pattern (react/vue `normalize-options.js`): default is the exact
    // negation of the TS-solution flag. Not exposed as a user-facing CLI
    // option here - see report for the scope rationale.
    useProjectJson: !isUsingTsSolutionConfig,
  };
}
