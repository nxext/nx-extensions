import {
  normalizePath,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { ConfigurationGeneratorSchema } from '../schema';

export function updateWorkspace(
  host: Tree,
  options: ConfigurationGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(host, options.project);
  const projectRoot = projectConfig.root;
  projectConfig.targets.build.options.assets = [
    ...projectConfig.targets.build.options.assets.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (asset: any) => !asset.toString().includes('src/favicon.ico')
    ),
    {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg',
    },
  ];

  projectConfig.targets.build.options.styles = [
    ...projectConfig.targets.build.options.styles,
    {
      input: normalizePath(`${projectRoot}/src/theme/variables.scss`),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/core.css'),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/normalize.css'),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/structure.css'),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/typography.css'),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/display.css'),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/padding.css'),
    },
    {
      input: normalizePath(
        'node_modules/@ionic/angular/css/float-elements.css'
      ),
    },
    {
      input: normalizePath(
        'node_modules/@ionic/angular/css/text-alignment.css'
      ),
    },
    {
      input: normalizePath(
        'node_modules/@ionic/angular/css/text-transformation.css'
      ),
    },
    {
      input: normalizePath('node_modules/@ionic/angular/css/flex-utils.css'),
    },
  ];

  updateProjectConfiguration(host, options.project, projectConfig);
}
