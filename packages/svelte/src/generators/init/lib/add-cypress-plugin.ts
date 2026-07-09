import { GeneratorCallback, Tree } from '@nx/devkit';
import { addCypressInitPlugin } from '@nxext/common';
import { Schema } from '../schema';

/**
 * Grundmuster (Guard + ensurePackage + cypressInitGenerator) kommt jetzt aus
 * `@nxext/common`. Das Prädikat selbst bleibt UNVERÄNDERT (byte-identisch
 * zur bisherigen Bedingung `!schema.unitTestRunner || schema.unitTestRunner
 * === 'jest'`, hier nur negiert, weil `addCypressInitPlugin`s Vertrag
 * "shouldRun() === true -> Generator läuft" statt "Bedingung erfüllt ->
 * No-Op" ist) - inklusive des in der Design-Analyse dokumentierten,
 * mutmaßlich falschen Bugs (gated auf `unitTestRunner` statt
 * `e2eTestRunner`). Wird bewusst NICHT korrigiert.
 */
export async function addCypressPlugin(
  tree: Tree,
  schema: Schema,
): Promise<GeneratorCallback> {
  return await addCypressInitPlugin(
    tree,
    () => !(!schema.unitTestRunner || schema.unitTestRunner === 'jest'),
  );
}
