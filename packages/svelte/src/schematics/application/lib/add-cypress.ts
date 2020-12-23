import {
  externalSchematic,
  noop,
  Rule,
  chain,
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';
import { updateWorkspaceInTree } from '@nrwl/workspace';
import * as url from 'url';

export function addCypress(options: NormalizedSchema): Rule {
  return options.e2eTestRunner === 'cypress'
    ? chain([
        externalSchematic('@nrwl/cypress', 'cypress-project', {
          ...options,
          name: options.projectName + '-e2e',
          project: options.projectName,
        }),
        updateWorkspaceJson(options),
      ])
    : noop();
}

function updateWorkspaceJson(options: NormalizedSchema): Rule {
  return updateWorkspaceInTree((workspaceJson) => {
    const architect =
      workspaceJson.projects[`${options.projectName}-e2e`].architect;

    const serverUrl = url.format({
      protocol: 'http',
      hostname: options.host,
      port: options.port.toString(),
    });

    architect.e2e = {
      ...architect.e2e,
      ...{
        options: {
          ...architect.e2e.options,
          baseUrl: serverUrl,
        },
      },
    };
    return workspaceJson;
  });
}
