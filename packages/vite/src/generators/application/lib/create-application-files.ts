import { NormalizedSchema } from '../schema';
import { names, offsetFromRoot, Tree, generateFiles } from '@nrwl/devkit';
import { join } from 'path';

export function createApplicationFiles(host: Tree, options: NormalizedSchema) {
  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
  };

  generateFiles(
    host,
    join(__dirname, '../files'),
    options.appProjectRoot,
    templateVariables
  );

  if (options.unitTestRunner === 'none') {
    host.delete(
      `${options.appProjectRoot}/src/app/${options.fileName}.spec.ts`
    );
  }
  generateFiles(
    host,
    join(__dirname, '../files'),
    options.appProjectRoot,
    templateVariables
  );
}
