import {
  addDependenciesToPackageJson,
  removeDependenciesFromPackageJson,
  Tree,
} from '@nrwl/devkit';
import {
  reactRouterDomVersion,
  typesReactRouterDomVersion,
} from '../../../utils/versions';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export function changeReactRouter(host: Tree) {
  const removeTask = removeDependenciesFromPackageJson(
    host,
    ['react-router-dom'],
    []
  );

  const routerTask = addDependenciesToPackageJson(
    host,
    { 'react-router-dom': reactRouterDomVersion },
    { '@types/react-router-dom': typesReactRouterDomVersion }
  );

  return runTasksInSerial(removeTask, routerTask);
}
