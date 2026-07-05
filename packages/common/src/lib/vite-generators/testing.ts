import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, writeJson } from '@nx/devkit';

/**
 * Test-Helper für Risiko 1 (Design 3.6): baut auf `createTreeWithEmptyWorkspace`
 * auf und ergänzt genau die Dateien/Inhalte, die `isUsingTsSolutionSetup`
 * (`@nx/js/internal`, nachgelesen in `ts-solution-setup.js`) prüft:
 *
 * - `isUsingPackageManagerWorkspaces(tree)`: für den Package-Manager, der
 *   sich beim Testlauf über `detectPackageManager('/virtual')` ergibt (in
 *   diesem Repo effektiv `pnpm`, weil weder `nx.json.cli.packageManager`
 *   gesetzt ist noch unter `/virtual` ein Lockfile existiert — die Erkennung
 *   fällt auf `detectInvokedPackageManager()` zurück, also
 *   `process.env.npm_config_user_agent`, das ein `pnpm nx test ...`-Lauf
 *   setzt): `pnpm-workspace.yaml` muss existieren und ein `packages`-Feld
 *   haben (`undefined` reicht nicht, eine leere Liste genügt).
 * - `isWorkspaceSetupWithTsSolution(tree)`:
 *   - Root-`tsconfig.json` UND Root-`tsconfig.base.json` müssen existieren.
 *   - `tsconfig.json.extends === './tsconfig.base.json'`.
 *   - `tsconfig.json.files` ODER `.include` ist gesetzt UND leer.
 *   - `tsconfig.base.json.compilerOptions.composite === true` und
 *     `declaration !== false`.
 *
 * Inhaltlich an `@nx/js`s eigenen `init`-Templates ausgerichtet
 * (`files/ts-solution/tsconfig.json__tmpl__` /
 * `tsconfig.base.json__tmpl__`), nicht 1:1 kopiert (kein `customConditions`/
 * `module`/`moduleResolution`-Preset nötig, da `isUsingTsSolutionSetup`
 * diese Felder nicht prüft) — bewusst minimal, um nur exakt das zu liefern,
 * was der Guard verlangt.
 */
export function createTsSolutionTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  // `pnpm-workspace.yaml` ist YAML, kein JSON — direkt als Text schreiben,
  // exakt in der Form, die `@zkochan/js-yaml` beim Lesen (`load`) wieder als
  // `{ packages: [...] }` zurückgibt.
  tree.write('pnpm-workspace.yaml', "packages:\n  - 'packages/*'\n");

  writeJson(tree, 'tsconfig.json', {
    extends: './tsconfig.base.json',
    compileOnSave: false,
    files: [],
    references: [],
  });

  writeJson(tree, 'tsconfig.base.json', {
    compilerOptions: {
      composite: true,
      declaration: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      target: 'es2022',
      paths: {},
    },
  });

  return tree;
}
