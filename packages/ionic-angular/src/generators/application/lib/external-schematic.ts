import {
  externalSchematic,
  noop,
  Rule,
  Tree,
} from '@angular-devkit/schematics';
import { NormalizedSchema } from '../schema';

export function generateNrwlAngularApplication(
  options: NormalizedSchema
): Rule {
  return externalSchematic('@nrwl/angular', 'application', {
    ...options,
    routing: true,
    style: 'scss',
  });
}

export function generateCapacitorProject(options: NormalizedSchema): Rule {
  return (host: Tree) => {
    const npmClient = host.exists('yarn.lock') ? 'yarn' : 'npm';

    return options.capacitor
      ? externalSchematic('@nxext/capacitor', 'capacitor-project', {
          project: options.appProjectName,
          appName: options.appName,
          appId: 'io.ionic.starter',
          npmClient,
        })
      : noop();
  };
}
