import { chain, Rule } from '@angular-devkit/schematics';
import { addPackageWithInit } from '@nrwl/workspace';
import { setDefaultCollection } from '@nrwl/workspace/src/utils/rules/workspace';
import { InitSchema } from './schema';
import { addStyledModuleDependencies } from './lib/add-style-module-dependencies';
import { addE2eDependencies } from './lib/add-e2e-dependencies';
import { moveToDevDependencies } from './lib/move-nxext-to-dev-dependencies';
import { addDependenciesForApptype } from './lib/add-dependencies-for-apptype';

export default function <T extends InitSchema>(options: T): Rule {
  return chain([
    addDependenciesForApptype(options.appType),
    moveToDevDependencies,
    addStyledModuleDependencies(options),
    addPackageWithInit(`@nrwl/jest`),
    addE2eDependencies(options),
    setDefaultCollection('@nxext/stencil'),
  ]);
}
