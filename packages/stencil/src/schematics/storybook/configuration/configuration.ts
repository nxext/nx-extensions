import {
  chain,
  externalSchematic, noop,
  Rule,
  schematic
} from '@angular-devkit/schematics';
import { StorybookConfigureSchema } from './schema';
import { CypressConfigureSchema } from '@nrwl/storybook/src/schematics/cypress-project/cypress-project';

export default function (options: StorybookConfigureSchema): Rule {
  return chain([
    schematic('storybook-init', options),
    options.configureCypress
      ? externalSchematic<CypressConfigureSchema>(
          '@nrwl/storybook',
          'cypress-project',
          {
            name: options.name,
            js: options.js,
            linter: options.linter,
          }
        )
      : noop(),
  ]);
}
