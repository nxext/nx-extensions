import { convertNxGenerator, formatFiles, Tree } from '@nx/devkit';
import { addCapacitorConfig } from './lib/add-capacitor-config';
import { addDependencies } from './lib/add-dependencies';
import { addProject } from './lib/add-project';
import { normalizeOptions } from './lib/normalize-options';
import { updateProjectGitignore } from './lib/update-project-gitignore';
import { updateProjectPackageJson } from './lib/update-project-package-json';
import { CapacitorConfigurationSchema } from './schema';

export async function capacitorConfigurationGenerator(
  host: Tree,
  options: CapacitorConfigurationSchema
) {
  const normalizedOptions = normalizeOptions(host, options);
  const installTask = addDependencies(host);
  addCapacitorConfig(host, normalizedOptions);
  updateProjectGitignore(host, normalizedOptions);
  addProject(host, normalizedOptions);
  updateProjectPackageJson(host, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return installTask;
}

export default capacitorConfigurationGenerator;
export const capacitorProjectSchematic = convertNxGenerator(
  capacitorConfigurationGenerator
);
