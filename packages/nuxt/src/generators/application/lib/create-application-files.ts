import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';
import { getRootTsConfigFileName } from '@nx/js';

export function createApplicationFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    rootTsConfig: joinPathFragments(
      offsetFromRoot(options.appProjectRoot),
      getRootTsConfigFileName(host)
    ),
    tmpl: '',
  };
  generateFiles(
    host,
    join(__dirname, '../files/base'),
    options.appProjectRoot,
    templateOptions
  );
}
