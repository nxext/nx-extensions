import {
  convertNxGenerator,
  formatFiles,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { addCapacitor } from './lib/add-capacitor';
import { addDependencies } from './lib/add-dependencies';
import { updateWorkspace } from './lib/update-workspace';
import { ConfigurationGeneratorSchema } from './schema';
import { addFiles, removeFiles } from './lib/files';
import { normalizeOptions } from './lib/normalize-options';
import { updateJestConfig } from './lib/update-jest-config';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';

export async function configurationGenerator(
  host: Tree,
  schema: ConfigurationGeneratorSchema
) {
  assertNotUsingTsSolutionSetup(host, '@nxext/ionic-angular', 'configuration');

  const options = await normalizeOptions(host, schema);
  const installTask = addDependencies(host);
  removeFiles(host, options);
  addFiles(host, options);
  updateWorkspace(host, options);
  updateJestConfig(host, options);

  const capacitorTask = await addCapacitor(host, options);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, capacitorTask);
}

export default configurationGenerator;
export const applicationSchematic = convertNxGenerator(configurationGenerator);
