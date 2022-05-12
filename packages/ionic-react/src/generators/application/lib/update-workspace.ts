import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function updateWorkspace(host: Tree, options: NormalizedSchema) {
  const project = readProjectConfiguration(host, options.appProjectName);
  project.targets.build.options.assets = [
    ...project.targets.build.options.assets.filter(
      (asset: string) => asset != options.appProjectRoot + '/src/favicon.ico'
    ),
    options.appProjectRoot + '/src/manifest.json',
  ];

  updateProjectConfiguration(host, options.appProjectName, project);
}
