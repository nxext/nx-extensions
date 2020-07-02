import { chain, noop, Rule } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addPackageWithInit,
  ProjectType,
  updateJsonInTree,
} from '@nrwl/workspace';
import { setDefaultCollection } from '@nrwl/workspace/src/utils/rules/workspace';
import {
  AppType,
  PROJECT_TYPE_DEPENDENCIES,
  STYLE_PLUGIN_DEPENDENCIES,
} from '../../utils/typings';
import { CoreSchema } from './schema';
import { LibrarySchema } from '../library/schema';
import { PWASchema } from '../ionic-pwa/schema';
import { ApplicationSchema } from '../application/schema';

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
  const testDependencies = PROJECT_TYPE_DEPENDENCIES['e2e'];

  return testDependencies
    ? addDepsToPackageJson(
        testDependencies.dependencies,
        testDependencies.devDependencies
      )
    : noop();
  if (options.e2eTestRunner === 'puppeteer') {
    return testDependencies
      ? addDepsToPackageJson(
          testDependencies.dependencies,
          testDependencies.devDependencies
        )
      : noop();
  }

  return noop();
}

const moveToDevDependencies = updateJsonInTree(
  'package.json',
  (packageJson) => {
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};

    if (packageJson.dependencies['@nxext/stencil']) {
      packageJson.devDependencies['@nxext/stencil'] =
        packageJson.dependencies['@nxext/stencil'];
      delete packageJson.dependencies['@nxext/stencil'];
    }
    return packageJson;
  }
);

export default function <T extends CoreSchema>(options: T): Rule {
  return chain([
    addDependencies(options.appType),
    moveToDevDependencies,
    addStyledModuleDependencies(options),
    addPackageWithInit(`@nrwl/jest`),
    addE2eDependencies(options),
    setDefaultCollection('@nxext/stencil'),
  ]);
}
