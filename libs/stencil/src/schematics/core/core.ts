import { chain, noop, Rule } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addPackageWithInit,
  ProjectType,
} from '@nrwl/workspace';
import { setDefaultCollection } from '@nrwl/workspace/src/utils/rules/workspace';
import {
  AppType,
  PROJECT_TYPE_DEPENDENCIES,
  STYLE_PLUGIN_DEPENDENCIES,
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

export function addBuilderToTarget(
  targetCollection,
  builder: string,
  projectType: ProjectType
) {
  targetCollection.add({
    name: builder,
    builder: `@nxext/stencil:${builder}`,
    options: {
      projectType,
    },
  });
}

export default function <T extends CoreSchema>(options: T): Rule {
  return chain([
    addDependencies(options.appType),
    addStyledModuleDependencies(options),
    addPackageWithInit('@nrwl/jest'),
    addE2eDependencies(options),
    setDefaultCollection('@nxext/stencil'),
  ]);
}
