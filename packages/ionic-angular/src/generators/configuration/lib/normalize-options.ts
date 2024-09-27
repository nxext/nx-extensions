import { readProjectConfiguration, Tree } from '@nx/devkit';
import { ConfigurationGeneratorSchema } from '../schema';

export interface NormalizedOptions extends ConfigurationGeneratorSchema {
  projectRoot: string;
}

export function normalizeOptions(
  host: Tree,
  schema: ConfigurationGeneratorSchema
): NormalizedOptions {
  const { root } = readProjectConfiguration(host, schema.project);

  return {
    projectRoot: root,
    ...schema,
  };
}
