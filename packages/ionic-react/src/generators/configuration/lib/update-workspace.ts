import {
  normalizePath,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function updateWorkspace(host: Tree, options: NormalizedSchema) {
  const project = readProjectConfiguration(host, options.project);
  project.targets.build ??= {
    options: {
      assets: [],
      styles: [],
    },
  };
  project.targets.build.options.assets = [
    ...project.targets.build.options.assets.filter(
      (asset: string | Record<string, string>) =>
        asset.toString().includes('src/favicon.ico') ||
        asset.toString().includes(`public/favicon.ico`)
    ),
    options.projectRoot + '/src/manifest.json',
    {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg',
    },
  ];

  project.targets.build.options.styles = [
    ...project.targets.build.options.styles,
    normalizePath(`${options.projectRoot}/src/theme/variables.css`),
  ];

  updateProjectConfiguration(host, options.project, project);
}
