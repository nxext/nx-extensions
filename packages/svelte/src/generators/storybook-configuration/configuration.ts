import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  ensurePackage,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { Linter } from '@nrwl/linter';

import { StorybookConfigureSchema } from './schema';
import { svelteLoaderVersion } from '../utils/versions';
import { readNxVersion } from '../init/lib/util';
import { updateMainJs } from './lib/update-main-js';
import { options } from 'yargs';

export async function configurationGenerator(
  host: Tree,
  schema: StorybookConfigureSchema
) {
  await ensurePackage(host, '@nrwl/storybook', readNxVersion(host));
  const { configurationGenerator } = await import('@nrwl/storybook');

  const uiFramework = '@storybook/svelte';
  const options = normalizeSchema(schema);
  const tasks: GeneratorCallback[] = [];

  const installTask = await addDependenciesToPackageJson(
    host,
    {},
    {
      'svelte-loader': svelteLoaderVersion,
    }
  );
  tasks.push(installTask);

  const storybookTask = await configurationGenerator(host, {
    name: options.name,
    uiFramework,
    configureCypress: options.configureCypress,
    js: options.js,
    linter: options.linter,
    cypressDirectory: options.cypressDirectory,
    standaloneConfig: options.standaloneConfig,
    tsConfiguration: options.tsConfiguration,
    configureTestRunner: options.configureTestRunner,
    bundler: 'webpack',
  });
  tasks.push(storybookTask);

  updateMainJs(host, options);

  await formatFiles(host);

  return runTasksInSerial(...tasks);
}

function normalizeSchema(
  schema: StorybookConfigureSchema
): StorybookConfigureSchema {
  const defaults = {
    configureCypress: true,
    linter: Linter.EsLint,
    js: false,
  };
  return {
    ...defaults,
    ...schema,
  };
}

export default configurationGenerator;
export const configurationSchematic = convertNxGenerator(
  configurationGenerator
);
