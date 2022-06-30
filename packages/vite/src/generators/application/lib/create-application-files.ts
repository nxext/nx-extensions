import { NormalizedSchema } from '../schema';
import { names, offsetFromRoot, Tree, generateFiles } from '@nxext/devkit';
import { join } from 'path';

export function createApplicationFiles(host: Tree, options: NormalizedSchema) {
  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };

  generateFiles(
    host,
    join(__dirname, '../files'),
    options.projectRoot,
    templateVariables
  );

  if (options.unitTestRunner === 'none') {
    host.delete(`${options.projectRoot}/src/app/${options.fileName}.spec.ts`);
  }
  generateFiles(
    host,
    join(__dirname, '../files'),
    options.projectRoot,
    templateVariables
  );
}
