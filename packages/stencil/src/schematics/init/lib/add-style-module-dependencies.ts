import { InitSchema } from '../schema';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../../utils/typings';
import { addDependenciesToPackageJson, GeneratorCallback, Tree } from '@nrwl/devkit';

export function addStyledDependencies<T extends InitSchema>(tree: Tree, options: T): GeneratorCallback[] {
  const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[options.style];
  const tasks: GeneratorCallback[] = [];

  if (styleDependencies) {
    tasks.push(
      addDependenciesToPackageJson(
        tree,
        styleDependencies.dependencies,
        styleDependencies.devDependencies
      )
    );
  }

  return tasks;
}
