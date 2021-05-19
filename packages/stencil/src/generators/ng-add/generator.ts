import { PROJECT_TYPE_DEPENDENCIES } from '../../utils/typings';
import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  Tree,
} from '@nrwl/devkit';

export async function ngAddGenerator(host: Tree) {
  const projectDependency = PROJECT_TYPE_DEPENDENCIES['init'];

  return addDependenciesToPackageJson(
    host,
    projectDependency.dependencies,
    projectDependency.devDependencies
  );
}

export default ngAddGenerator;
export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
