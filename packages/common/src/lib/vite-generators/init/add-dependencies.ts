import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nx/devkit';
import { FrameworkDependencyMap } from '../types';

/**
 * Funktionshülle identisch in preact/solid/svelte
 * (`addDependenciesToPackageJson(tree, {}, {...})`); nur die
 * Dependency-Map (Namen + Version-Konstanten) unterscheidet sich pro
 * Framework und wird hier als Parameter übergeben.
 */
export function addFrameworkDependencies(
  tree: Tree,
  deps: FrameworkDependencyMap
): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    deps.dependencies,
    deps.devDependencies
  );
}
