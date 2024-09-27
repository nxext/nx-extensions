import {
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedOptions } from './normalize-options';

export function addFiles(host: Tree, options: NormalizedOptions) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  const filesDir = normalizePath(__dirname + '/../files');

  generateFiles(host, filesDir, options.projectRoot, templateOptions);
}

export function removeFiles(host: Tree, options: NormalizedOptions) {
  host.delete(`${options.projectRoot}/public/favicon.ico`);
  host.delete(`${options.projectRoot}/src/favicon.ico`);
  host.delete(`${options.projectRoot}/src/app`);
}
