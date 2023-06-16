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

  nxJson.generators = nxJson.generators || {};
  nxJson.generators['@nxext/vue'] = nxJson.generators['@nxext/vue'] || {};

  const prev = { ...nxJson.generators['@nxext/vue'] };

  const appDefaults = {
    linter: options.linter,
    ...prev.application,
  };
  const componentDefaults = {
    ...prev.component,
  };
  const libDefaults = {
    linter: options.linter,
    ...prev.library,
  };

  nxJson.generators = {
    ...nxJson.generators,
    '@nxext/vue': {
      ...prev,
      application: appDefaults,
      component: componentDefaults,
      library: libDefaults,
    },
  };

  updateNxJson(host, nxJson);
}
