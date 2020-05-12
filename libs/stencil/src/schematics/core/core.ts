import { chain, noop, Rule, externalSchematic } from '@angular-devkit/schematics';
import { addDepsToPackageJson, addPackageWithInit, projectRootDir, updateWorkspace } from '@nrwl/workspace';
import { setDefaultCollection } from '@nrwl/workspace/src/utils/rules/workspace';
import {
  AppType,
  PROJECT_TYPE_DEPENDENCIES,
  STYLE_PLUGIN_DEPENDENCIES
} from '../../utils/typings';
import { CoreSchema } from './schema';

function addDependencies(appType: AppType): Rule {
  const projectDependency = PROJECT_TYPE_DEPENDENCIES[appType];
  return addDepsToPackageJson(
    projectDependency.dependencies,
    projectDependency.devDependencies
  );
}

function addStyledModuleDependencies<T extends CoreSchema>(options: T): Rule {
  const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[options.style];

  return styleDependencies
    ? addDepsToPackageJson(
      styleDependencies.dependencies,
      styleDependencies.devDependencies
    )
    : noop();
}

function addE2eDependencies<T extends CoreSchema>(options: T): Rule {
  const styleDependencies = PROJECT_TYPE_DEPENDENCIES['e2e'];

  return styleDependencies
    ? addDepsToPackageJson(
      styleDependencies.dependencies,
      styleDependencies.devDependencies
    )
    : noop();
}

export default function <T extends CoreSchema>(options: T) {
  return chain([
    addDependencies(options.appType),
    addStyledModuleDependencies(options),
    addE2eDependencies(options),
    setDefaultCollection('@nxext/stencil')
  ]);
}
