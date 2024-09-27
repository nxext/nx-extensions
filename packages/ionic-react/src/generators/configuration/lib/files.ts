import {
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  generateFiles(
    host,
    normalizePath(__dirname + '/../files'),
    options.projectRoot,
    templateOptions
  );
}

export function deleteFiles(host: Tree, options: NormalizedSchema) {
  host.delete(options.projectRoot + '/src/favicon.ico');
  host.delete(options.projectRoot + `/src/app`);
  host.delete(options.projectRoot + `/src/styles.css`);

  return host;
}
