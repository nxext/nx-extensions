import { GeneratorCallback, Tree } from '@nx/devkit';
import { addJestInitPlugin } from '@nxext/common';
import { Schema } from '../schema';

/**
 * Grundmuster (Guard + ensurePackage + jestInitGenerator) kommt jetzt aus
 * `@nxext/common`. Das Prädikat selbst bleibt UNVERÄNDERT (byte-identisch
 * zur bisherigen Bedingung `!schema.unitTestRunner || schema.unitTestRunner
 * === 'jest'`, hier nur negiert, weil `addJestInitPlugin`s Vertrag
 * "shouldRun() === true -> Generator läuft" statt "Bedingung erfüllt ->
 * No-Op" ist) - inklusive des in der Design-Analyse dokumentierten,
 * mutmaßlich invertierten Bugs (läuft nur, wenn `unitTestRunner` NICHT
 * `jest` ist). Wird bewusst NICHT korrigiert.
 */
export async function addJestPlugin(
  tree: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  return await addJestInitPlugin(
    tree,
    () => !(!schema.unitTestRunner || schema.unitTestRunner === 'jest')
  );
}
