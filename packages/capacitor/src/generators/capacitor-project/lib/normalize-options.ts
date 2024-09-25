import {
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { CapacitorGeneratorSchema, NormalizedSchema } from '../schema';

export function normalizeOptions(
  host: Tree,
  options: CapacitorGeneratorSchema
): NormalizedSchema {
  const appName = options.appName ? options.appName : options.project;
  const { root } = readProjectConfiguration(host, options.project);
  const webDir = options.webDir
    ? options.webDir
    : joinPathFragments(`dist/${root}`);

  return {
    ...options,
    appName,
    webDir,
    projectRoot: root,
    pathToRoot: offsetFromRoot(root),
  };
}
