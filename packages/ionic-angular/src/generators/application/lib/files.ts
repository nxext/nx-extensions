import {
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

function addBaseFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
  };

  const filesDir = options.standalone
    ? normalizePath(__dirname + '/../files/base-standalone')
    : normalizePath(__dirname + '/../files/base');

  generateFiles(host, filesDir, options.appProjectRoot, templateOptions);
}

function addTemplateFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
  };

  const filesDir = options.standalone
    ? normalizePath(__dirname + `/../files/${options.template}-standalone`)
    : normalizePath(__dirname + `/../files/${options.template}`);

  generateFiles(host, filesDir, options.appProjectRoot, templateOptions);
}

export function addFiles(host: Tree, options: NormalizedSchema) {
  addBaseFiles(host, options);
  addTemplateFiles(host, options);

  if (options.unitTestRunner === 'none') {
    host.delete(`${options.appProjectRoot}/src/app/app.component.spec.ts`);
  }
}

export function removeFiles(host: Tree, options: NormalizedSchema) {
  host.delete(`${options.appProjectRoot}/src/favicon.ico`);
}
