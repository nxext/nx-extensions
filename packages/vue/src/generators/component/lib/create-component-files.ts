import { generateFiles, names, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';

export function createComponentFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    className: names(options.name).className,
    template: '',
  };
  generateFiles(
    tree,
    join(__dirname, '../files'),
    options.projectRoot,
    templateOptions
  );
}
