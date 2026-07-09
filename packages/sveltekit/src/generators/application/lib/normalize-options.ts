import { joinPathFragments, Tree, workspaceRoot } from '@nx/devkit';
import { normalizeViteAppCore } from '@nxext/common';
import { relative } from 'path';
import { NormalizedSchema, SveltekitGeneratorSchema } from '../schema';

/**
 * Kernanteil (projectName/projectRoot-Auflösung via
 * `determineProjectNameAndRootOptions`, `parsedTags`, `importPath` +
 * `isUsingTsSolutionConfig`) kommt jetzt aus `@nxext/common`'s
 * `normalizeViteAppCore` (identisch zu svelte/preact/solid) statt aus einem
 * eigenständigen `@nx/devkit/internal`-Aufruf (Design 3.3 "sveltekit muss
 * zuerst an den Kern angebunden werden"). sveltekit-Eigenheiten bleiben
 * bewusst lokal: die `distDir`-Berechnung (relative Pfad-Differenz zwischen
 * Projekt-Root und `dist/<projectRoot>`, gebraucht von nachgelagerten
 * add-outputtarget-ähnlichen Konsumenten) hat kein Äquivalent im Kern.
 */
export async function normalizeOptions(
  host: Tree,
  options: SveltekitGeneratorSchema,
): Promise<NormalizedSchema> {
  const {
    projectName,
    projectRoot,
    parsedTags,
    importPath,
    isUsingTsSolutionConfig,
  } = await normalizeViteAppCore(
    host,
    {
      name: options.name,
      // `directory` is optional on the schema, but normalizeViteAppCore's
      // resolver (like the determineProjectNameAndRootOptions call it
      // replaces) requires a definite string - an empty value falls back to
      // the default as-provided location: `<name>` at the workspace root.
      directory: options.directory ?? '',
      tags: options.tags,
      rootProject: options.rootProject,
    },
    'application',
  );
  options.name ??= projectName;
  options.rootProject = projectRoot === '.';

  const distDir = relative(
    joinPathFragments(`${workspaceRoot}/${projectRoot}`),
    joinPathFragments(`${workspaceRoot}/dist/${projectRoot}`),
  );

  return {
    ...options,
    projectName,
    projectRoot,
    distDir,
    parsedTags,
    importPath,
    isUsingTsSolutionConfig,
    // Nx pattern (react/vue normalize-options.js, already mirrored by
    // @nxext/svelte's own normalize-options.ts): default is the exact
    // negation of the TS-solution flag.
    useProjectJson: !isUsingTsSolutionConfig,
  };
}
