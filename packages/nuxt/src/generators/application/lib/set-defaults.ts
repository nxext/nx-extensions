import { readNxJson, Tree, updateNxJson } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function setDefaults(host: Tree, options: NormalizedSchema) {
  if (options.skipNxJson) {
    return;
  }

  const nxJson = readNxJson(host);

  if (options.rootProject) {
    nxJson.defaultProject = options.appProjectName;
  }

  nxJson.generators = {
    ...(nxJson.generators ?? {}),
    '@nxext/nuxt': {
      ...(nxJson.generators?.['@nxext/nuxt'] ?? {}),
      application: {
        linter: options.linter,
        ...(nxJson.generators?.['@nxext/nuxt']?.application ?? {}),
      },
    },
  };

  updateNxJson(host, nxJson);
}
