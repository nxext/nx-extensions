import { Tree, updateJson } from '@nx/devkit';

/**
 * Kernlogik (JSON-Update) identisch in allen drei Paketen. Der Gating-Ort
 * (intern in preact/solid, extern in svelte) bleibt Sache des Aufrufers —
 * siehe `shouldUpdateNpmScope` unten für die dazu passende, ebenfalls
 * identische Bedingung.
 */
export function updateLibPackageNpmScope(
  host: Tree,
  options: { projectRoot: string; importPath: string }
): void {
  updateJson(host, `${options.projectRoot}/package.json`, (json) => {
    json.name = options.importPath;
    return json;
  });
}

export function shouldUpdateNpmScope(options: {
  buildable?: boolean;
  publishable?: boolean;
}): boolean {
  return !!(options.buildable || options.publishable);
}
