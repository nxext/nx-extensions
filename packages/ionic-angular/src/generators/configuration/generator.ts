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

export async function configurationGenerator(
  host: Tree,
  schema: ConfigurationGeneratorSchema
) {
  const installTask = addDependencies(host);
  updateWorkspace(host, schema);

  const capacitorTask = await addCapacitor(host, schema);

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, capacitorTask);
}

export default configurationGenerator;
export const applicationSchematic = convertNxGenerator(configurationGenerator);
