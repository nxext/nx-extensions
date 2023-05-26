import {
  convertNxGenerator,
  formatFiles,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { addAngular } from './lib/add-angular';
import { addCapacitor } from './lib/add-capacitor';
import { addDependencies } from './lib/add-dependencies';
import { addFiles, removeFiles } from './lib/files';
import { normalizeOptions } from './lib/normalize-options';
import { updateEslintConfig } from './lib/update-eslint-config';
import { updateWorkspace } from './lib/update-workspace';
import { ApplicationGeneratorSchema } from './schema';

export async function applicationGenerator(
  host: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(host, schema);

  const installTask = addDependencies(host);
  const angularTask = await addAngular(host, options);
  addFiles(host, options);
  removeFiles(host, options);
  updateWorkspace(host, options);
  updateEslintConfig(host, options);

  const capacitorTask = await addCapacitor(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, angularTask, capacitorTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
