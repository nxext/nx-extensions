import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
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
  options: ApplicationGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);

  const installTask = addDependencies(host);
  const angularTask = await addAngular(host, options);
  addFiles(host, normalizedOptions);
  removeFiles(host, normalizedOptions);
  updateWorkspace(host, normalizedOptions);
  updateEslintConfig(host, normalizedOptions);

  let capacitorTask: GeneratorCallback | null = null;
  if (options.capacitor) {
    capacitorTask = await addCapacitor(host, normalizedOptions);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return () => {
    installTask();
    angularTask();

    if (capacitorTask) {
      capacitorTask();
    }
  };
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
