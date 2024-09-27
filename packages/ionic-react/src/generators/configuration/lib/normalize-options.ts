import { readProjectConfiguration, Tree } from '@nx/devkit';
import { ConfigurationGeneratorSchema, NormalizedSchema } from '../schema';

export function normalizeOptions(
  host: Tree,
  options: ConfigurationGeneratorSchema
): NormalizedSchema {
  const projectConfig = readProjectConfiguration(host, options.project);

  return {
    ...options,
    project: options.project,
    projectRoot: projectConfig.root,
  };
}
