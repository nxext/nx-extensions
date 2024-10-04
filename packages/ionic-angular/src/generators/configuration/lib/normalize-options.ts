import {
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from '../schema';

export interface NormalizedOptions extends ConfigurationGeneratorSchema {
  projectRoot: string;
  prefix: string;
}

type AngularProjectConfiguration = ProjectConfiguration & {
  prefix?: string;
};

export async function normalizeOptions(
  host: Tree,
  schema: ConfigurationGeneratorSchema
): Promise<NormalizedOptions> {
  const { root, prefix } = readProjectConfiguration(
    host,
    schema.project
  ) as AngularProjectConfiguration;

  return {
    projectRoot: root,
    prefix,
    ...schema,
  };
}
