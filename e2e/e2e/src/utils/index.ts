export { killPort } from './kill';
export { newProject } from './new-project';
export {
  packageInstall,
  detectPackageManager,
  getPackageManagerNxCommand,
  getSelectedPackageManager,
} from './package-manager';
export type { PackageManager } from './package-manager';
export { runCreateWorkspace } from './create-workspace';
export { cleanupAll, cleanupProject } from './cleanup';
export { getNxVersion, getPublishedVersion } from './get-versions';
export { updatePackageJsonFiles } from './json-utils';

process.env.npm_config_registry = `http://localhost:4872/`;
process.env.YARN_REGISTRY = process.env.npm_config_registry;
