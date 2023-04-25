import {
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addBaseFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
  };

  generateFiles(
    host,
    normalizePath(__dirname + '/../files/base'),
    options.appProjectRoot,
    templateOptions
  );
}

export function addTemplateFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
  };

  generateFiles(
    host,
    normalizePath(__dirname + `/../files/${options.template}`),
    options.appProjectRoot,
    templateOptions
  );
}

export function addFiles(host: Tree, options: NormalizedSchema) {
  addBaseFiles(host, options);
  addTemplateFiles(host, options);

  if (options.unitTestRunner === 'none') {
    host.delete(`${options.appProjectRoot}/src/app/App.spec.tsx`);
  }
}

export function deleteUnusedFiles(host: Tree, options: NormalizedSchema) {
  host.delete(options.appProjectRoot + '/src/favicon.ico');
  host.delete(options.appProjectRoot + `/src/app/App.css`);
  host.delete(options.appProjectRoot + `/src/app/logo.svg`);
  host.delete(options.appProjectRoot + `/src/app/star.svg`);

  return host;
}
