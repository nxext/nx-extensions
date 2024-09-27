import { readProjectConfiguration, Tree } from '@nx/devkit';
import { ConfigurationGeneratorSchema } from '../schema';

export interface NormalizedOptions extends ConfigurationGeneratorSchema {
  projectRoot: string;
  prefix: string;
}

export async function normalizeOptions(
  host: Tree,
  schema: ConfigurationGeneratorSchema
): Promise<NormalizedOptions> {
  const { root } = readProjectConfiguration(host, schema.project);
  const { getNpmScope } = await import(
    '@nx/js/src/utils/package-json/get-npm-scope'
  );
  const npmScope = getNpmScope(host);

  return {
    projectRoot: root,
    prefix: npmScope,
    ...schema,
  };
}
