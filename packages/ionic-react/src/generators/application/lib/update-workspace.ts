import {
  normalizePath,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
export function updateWorkspace(host: Tree, options: NormalizedSchema) {
  const project = readProjectConfiguration(host, options.appProjectName);
  project.targets.build.options.assets = [
    ...project.targets.build.options.assets.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (asset: any) => !asset.toString().includes('src/favicon.ico')
    ),
    options.appProjectRoot + '/src/manifest.json',
    {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg',
    },
  ];

  project.targets.build.options.styles = [
    ...project.targets.build.options.styles,
    {
      input: normalizePath(`${options.appProjectRoot}/src/theme/variables.css`),
    },
  ];

  updateProjectConfiguration(host, options.appProjectName, project);
}
