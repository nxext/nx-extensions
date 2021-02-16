import { NormalizedSchema } from '../schema';
import { apply, applyTemplates, mergeWith, move, Rule, url } from '@angular-devkit/schematics';
import { names } from '@nrwl/devkit';
import { offsetFromRoot } from '@nrwl/workspace';

export function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        projectRoot: options.projectRoot,
      }),
      move(options.projectRoot),
    ])
  );
}
