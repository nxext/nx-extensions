import {
  generateFiles,
  joinPathFragments,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addCapacitorConfig(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    webDir: normalizePath(
      joinPathFragments(options.pathToRoot, options.webDir)
    ),
    template: '',
  };

  generateFiles(
    host,
    normalizePath(__dirname + '/../files/capacitor-config'),
    options.projectRoot,
    templateOptions
  );
}
