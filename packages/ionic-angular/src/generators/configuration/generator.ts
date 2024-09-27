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

export async function configurationGenerator(
  host: Tree,
  schema: ConfigurationGeneratorSchema
) {
  const options = await normalizeOptions(host, schema);
  const installTask = addDependencies(host);
  removeFiles(host, options);
  addFiles(host, options);
  updateWorkspace(host, options);

  const capacitorTask = await addCapacitor(host, options);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, capacitorTask);
}

export default configurationGenerator;
export const applicationSchematic = convertNxGenerator(configurationGenerator);
