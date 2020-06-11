import {
  applyTemplates,
  chain,
  externalSchematic,
  move,
  noop,
  Rule,
  schematic,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  getProjectConfig,
  offsetFromRoot,
  updateWorkspace,
} from '@nrwl/workspace';
import { join, normalize } from '@angular-devkit/core';
import { StorybookConfigureSchema } from './schema';
import { toJS } from '@nrwl/workspace/src/utils/rules/to-js';
import { CypressConfigureSchema } from '@nrwl/storybook/src/schematics/cypress-project/cypress-project';
import { applyWithSkipExisting, parseJsonAtPath } from '../../../utils/utils';

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
      : () => {},
  ]);
}
