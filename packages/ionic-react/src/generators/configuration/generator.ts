import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { addCapacitor } from './lib/add-capacitor';
import { addDependencies } from './lib/add-dependencies';
import { addFiles, deleteFiles } from './lib/files';
import { normalizeOptions } from './lib/normalize-options';
import { updateWorkspace } from './lib/update-workspace';
import { ConfigurationGeneratorSchema } from './schema';

export async function configurationGenerator(
  host: Tree,
  options: ConfigurationGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);
  const installTask = addDependencies(host);
  addFiles(host, normalizedOptions);
  deleteFiles(host, normalizedOptions);
  updateWorkspace(host, normalizedOptions);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let capacitorTask: GeneratorCallback = () => {};
  if (options.capacitor) {
    capacitorTask = await addCapacitor(host, normalizedOptions);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, capacitorTask);
}

export default configurationGenerator;
export const applicationSchematic = convertNxGenerator(configurationGenerator);
