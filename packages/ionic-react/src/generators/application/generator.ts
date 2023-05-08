import {
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { addCapacitor } from './lib/add-capacitor';
import { addDependencies } from './lib/add-dependencies';
import { addReact } from './lib/add-react';
import { addFiles, deleteUnusedFiles } from './lib/files';
import { normalizeOptions } from './lib/normalize-options';
import { updateWorkspace } from './lib/update-workspace';
import { ApplicationGeneratorSchema } from './schema';
import { changeReactRouter } from './lib/change-react-router';
import { removePlainReactapp } from './lib/remove-plain-reactapp';
import { updateJestBabelSetup } from './lib/update-jest-babel-setup';
import { updateCypressSetup } from './lib/update-cypress-setup';

export async function applicationGenerator(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);
  const installTask = addDependencies(host);
  const reactTask = await addReact(host, options);
  const routerTask = changeReactRouter(host);
  addFiles(host, normalizedOptions);
  deleteUnusedFiles(host, normalizedOptions);
  updateWorkspace(host, normalizedOptions);
  removePlainReactapp(host, normalizedOptions);
  updateJestBabelSetup(host, normalizedOptions);
  updateCypressSetup(host, normalizedOptions);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let capacitorTask: GeneratorCallback = () => {};
  if (options.capacitor) {
    capacitorTask = await addCapacitor(host, normalizedOptions);
  }

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask, reactTask, routerTask, capacitorTask);
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
