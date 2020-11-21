import { InitSchema } from '../schema';
import { noop, Rule } from '@angular-devkit/schematics';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../../utils/typings';
import { addDepsToPackageJson } from '@nrwl/workspace';

export function addStyledModuleDependencies<T extends InitSchema>(options: T): Rule {
  const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[options.style];

  return styleDependencies
    ? addDepsToPackageJson(
      styleDependencies.dependencies,
      styleDependencies.devDependencies
    )
    : noop();
}
