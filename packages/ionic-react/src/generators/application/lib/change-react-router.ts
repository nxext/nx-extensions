import {
  addDependenciesToPackageJson,
  removeDependenciesFromPackageJson,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import {
  reactRouterDomVersion,
  typesReactRouterDomVersion,
} from '../../../utils/versions';

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
